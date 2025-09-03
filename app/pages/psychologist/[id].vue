<template>
  <UContainer class="py-10">
    <UCard v-if="psychologist" class="max-w-4xl mx-auto p-6 relative">
      <!-- FOTO DE PERFIL EM CIMA -->
      <div class="flex justify-center ">
        <img
          :src="psychologist.profilePicture || 'https://via.placeholder.com/150'"
          alt="Foto do Psicólogo"
          class="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white"
        />
      </div>

      <!-- INFOS -->
      <div class="mt-6 text-center">
        <h1 class="text-3xl font-bold mb-1">{{ psychologist.username }}</h1>
        <p class="text-white">{{ psychologist.email }}</p>
        <p class="mt-4">{{ psychologist.psychologistInfo?.description }}</p>

        <div class="mt-6 space-y-2 text-sm text-white">
          <p><strong>Preço da consulta:</strong> R$ {{ psychologist.psychologistInfo?.consultationPrice }}</p>
          <p><strong>Atendimento:</strong> {{ psychologist.psychologistInfo?.type }}</p>
          <p>
            <strong>Contato:</strong>
            {{ psychologist.email }} • {{ psychologist.psychologistInfo?.phoneNumber }}
          </p>
          <p><strong>Localização:</strong> {{ psychologist.psychologistInfo?.city }} - {{ psychologist.psychologistInfo?.state }}</p>
        </div>

        <!-- BOTÃO DE AÇÃO -->
        <div class="mt-6">
          <UButton class="cursor-pointer" @click="agendarAberto = true">Agendar Consulta</UButton>
        </div>
             <div class="mt-4">
  <UButton
    color="primary"
    class="cursor-pointer"
    @click="verNoGoogleMaps(psychologist.psychologistInfo?.latitude, psychologist.psychologistInfo?.longitude)"
  >
    Ver no Google Maps
  </UButton>
</div>
      </div>
 
    </UCard>

    <!-- Loading -->
    <div v-else class="text-center py-20 text-gray-500">
      Carregando informações do psicólogo...
    </div>

    <!-- MODAL DE AGENDAMENTO -->
    <UModal
      v-model:open="agendarAberto"
      title="Agendar Consulta"
      description="Preencha os dados para solicitar o agendamento."
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form class="space-y-4">
          <UFormGroup label="Nome completo">
            <UInput placeholder="Seu nome" />
          </UFormGroup>

          <UFormGroup label="Data preferida">
            <UInput type="date" />
          </UFormGroup>

          <UFormGroup label="Tipo de atendimento">
            <USelect :options="['Online', 'Presencial']" />
          </UFormGroup>
        </form>
      </template>

      <template #footer="{ close }">
        <UButton label="Cancelar" color="neutral" variant="outline" @click="close" />
        <UButton label="Confirmar" color="primary" />
      </template>
    </UModal>
  </UContainer>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'

definePageMeta({ layout: false })

const route = useRoute()
const userStore = useUserStore()
const agendarAberto = ref(false)
function verNoGoogleMaps(lat: number | undefined, lng: number | undefined) {
  if (!lat || !lng) {
    alert("Localização não disponível.");
    return;
  }

  // URL para abrir o Google Maps na localização
  const url = `https://www.google.com/maps?q=${lat},${lng}&hl=pt-BR`;
  window.open(url, "_blank"); // abre em nova aba
}
const psychologist = ref<any>(null)

onMounted(async () => {
  const id = route.params.id as string
  await userStore.fetchPsychologistInfo(id)
  psychologist.value = userStore.psychologistInfo
})
</script>
