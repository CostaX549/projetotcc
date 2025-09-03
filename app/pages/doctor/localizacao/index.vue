<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { usePsychologistStore } from '~/stores/psychologist'
import { useRouter } from 'vue-router'
import { vMaska } from 'maska/vue'
definePageMeta({ layout: false })

const state = ref<any>(null)
const city = ref<any>(null)
const cep = ref('')
const streetNumber = ref('')
const router = useRouter()
const psychologistStore = usePsychologistStore()
const consultationType = ref<string | null>(null)
const statesOptions = ref<{ label: string; value: string; sigla: string }[]>([])
const citiesOptions = ref<{ label: string; value: string }[]>([])
const cepData = ref<any>(null)
// Carregar estados do IBGE
const loadStates = async () => {
  const res = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
  statesOptions.value = res.data
    .sort((a: any, b: any) => a.nome.localeCompare(b.nome))
    .map((s: any) => ({ label: s.nome, value: s.id, sigla: s.sigla }))
}
onMounted(loadStates)

// Carregar cidades baseado no estado selecionado
watch(state, async (newState) => {
  city.value = ''
  citiesOptions.value = []

  if (!newState) return

  try {
    const res = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${newState.value}/municipios`)
    citiesOptions.value = res.data.map((c: any) => ({ label: c.nome, value: c.nome }))
  } catch (err) {
    console.error('Erro ao carregar cidades:', err)
  }
})

// Função para buscar latitude e longitude
const fetchLatLong = async () => {
  if (!cepData.value || !streetNumber.value) return null

  const { logradouro, bairro, localidade, uf } = cepData.value

  try {
    // Consultar latitude/longitude no Nominatim
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        street: `${logradouro}, ${streetNumber.value}`,
        city: localidade,
        state: uf,
        country: "Brasil",
        format: "json",
        limit: 1,
        addressdetails: 1,
        email: "seuemail@exemplo.com"
      }
    });

    if (res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lon: parseFloat(res.data[0].lon)
      };
    }

    return null;
  } catch (err) {
    console.error("Erro ao buscar coordenadas:", err);
    return null;
  }
};
// 🔹 Função para buscar CEP
const fetchCep = async () => {
  const cleanCep = cep.value.replace(/\D/g, '')
  if (cleanCep.length !== 8) {
    alert('CEP inválido. Digite 8 números.')
    return
  }

  try {
    const res = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`)
    if (res.data.erro) {
      alert('CEP não encontrado')
      return
    }
    cepData.value = res.data
    const { uf, localidade } = res.data

    // Preencher estado automaticamente
    const foundState = statesOptions.value.find(s => s.sigla === uf)
    if (foundState) {
      state.value = foundState

      // Carregar cidades do estado e selecionar a cidade correspondente
      const citiesRes = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${foundState.value}/municipios`)
      citiesOptions.value = citiesRes.data.map((c: any) => ({ label: c.nome, value: c.nome }))

      const foundCity = citiesOptions.value.find(c => c.label.toLowerCase() === localidade.toLowerCase())
      if (foundCity) {
        city.value = foundCity
      }
    }
  } catch (err) {
    console.error('Erro ao buscar CEP:', err)
    alert('Erro ao buscar CEP')
  }
}

// Função para enviar localização
const submitLocation = async () => {
  if (!state.value || !city.value || !cep.value || !streetNumber.value) {
    alert('Preencha todos os campos de localização')
    return
  }
  
  const coords = await fetchLatLong()

  const stateName = state.value?.label
  if (!stateName) {
    alert('Estado inválido')
    return
  }
console.log(consultationType.value);
  const res = await psychologistStore.updateLocation(
    stateName,
    city.value?.label,
    cep.value,
    streetNumber.value,
   coords?.lat ?? null,
    coords?.lon ?? null,
     consultationType.value
  )

  if (res) {
    router.push('/doctor')
  }
}

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-6 space-y-6">
    <div class="flex flex-col items-center mb-6 text-center">
      <svg class="w-10 h-10 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      </svg>
      <h2 class="text-xl font-bold">Falta pouco para completar seu registro!</h2>
      <h2 class="text-xl font-bold">Coloque a localização do seu consultório e o tipo de consulta</h2>
    </div>

    <div class="flex flex-col gap-4 w-full max-w-md">
      <USelectMenu
  v-model="consultationType"
  :items="[
    { label: 'Híbrido', value: 'Híbrido' },
    { label: 'Presencial', value: 'Presencial' },
    { label: 'Online', value: 'Online' }
  ]"
  label="Tipo de Consulta"
  placeholder="Selecione o tipo de consulta"
  clearable
  class="text-base py-2"
/>
      <USelectMenu
        v-model="state"
        :items="statesOptions"
        label="Estado"
        placeholder="Selecione um estado"
        clearable
        class="text-base py-2"
      />

      <USelectMenu
        v-model="city"
        :items="citiesOptions"
        label="Cidade"
        placeholder="Selecione uma cidade"
        :disabled="!state"
        clearable
        class="text-base py-2"
      />

    <UInput
  v-model="cep"
  label="CEP"
    v-maska="'#####-###'"
  placeholder="Digite seu CEP"
  @blur="fetchCep"
/>

      <UInput
        v-model="streetNumber"
        label="Número"
        placeholder="Número do consultório"
      />

      <UButton
        color="primary"
        class="w-full text-base py-2 flex items-center justify-center"
        @click="submitLocation"
      >
        Salvar localização
      </UButton>
    </div>
  </div>
</template>
