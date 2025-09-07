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

        <div class="mt-6">
          <UButton class="cursor-pointer" @click="agendarAberto = true">Agendar Consulta</UButton>
        </div>
      </div>
    </UCard>

    <div v-else class="text-center py-20 text-gray-500">
      Carregando informações do psicólogo...
    </div>

    <UModal
      v-model:open="agendarAberto"
      title="Agendar Consulta"
      description="Escolha uma data e horário."
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>

          <UCalendar v-model="dataConsulta"   locale="pt-BR">
            <template #day="{ day }">
              <!-- Pega o dia da semana -->
              <UChip
                :show="true"
               
        :color="isWorkingDay(day.toDate('UTC')) ? 'success' : 'error'" 
                size="2xs"
                class="w-8 h-8 flex justify-center items-center cursor-pointer"
              >
                {{ day.day }}
              </UChip>
            </template>
          </UCalendar>
 

  
  <div class="flex flex-wrap gap-2">
    <UBadge
      v-for="hora in horariosDisponiveis"
      :key="hora"
      class="cursor-pointer"
      color="primary"
      @click="horaConsulta = hora"
      :variant="horaConsulta === hora ? 'solid' : 'outline'"
    >
      {{ hora }}
    </UBadge>
  </div>

      </template>

      <template #footer="{ close }">
        <UButton label="Cancelar" color="neutral" variant="outline" @click="close" />
        <UButton label="Confirmar" color="primary" @click="confirmarAgendamento()" />
      </template>
    </UModal>
  </UContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/stores/user'
import { CalendarDate } from '@internationalized/date'
import { isJSDocTypeTag } from 'typescript'

definePageMeta({ layout: 'user' })

const route = useRoute()
const userStore = useUserStore()

const agendarAberto = ref(false)
const psychologist = ref<any>(null)
const dataConsulta = ref<any>(new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()))
const horaConsulta = ref('')

// Horários disponíveis para o dia selecionado
const horariosDisponiveis = ref<string[]>([])

onMounted(async () => {
  const id = route.params.id as string
  await userStore.fetchPsychologistInfo(id)
  psychologist.value = userStore.psychologistInfo
})

const diasAtendimento = computed(() => {
  return (
    psychologist.value?.psychologistInfo?.workingHours
      ?.map((h: any) => {
        const oldDay = Number(h.dayOfWeek) // Supondo que venha 0 = Segunda, ..., 6 = Domingo
        return oldDay === 0 ? 6 : oldDay - 1 // Ajusta Domingo e decrementa para novo padrão
      }) || []
  )
})

function isWorkingDay(date: Date) {
  const dayNumber = date.getDay() // Domingo = 0, Segunda = 1, ..., Sábado = 6

  const working = diasAtendimento.value.includes(dayNumber)

  return working
}
async function confirmarAgendamento() {
  if (!dataConsulta.value || !horaConsulta.value) return
  console.log(dataConsulta.value)
console.log(psychologist.value.psychologistInfo.id)
console.log(dataConsulta.value)
console.log(horaConsulta.value)
const date = dataConsulta.value.toDate()
  const [h, m] = horaConsulta.value.split(':').map(Number)
  date.setHours(h, m, 0, 0)
console.log(date)

// Gera string no formato 'YYYY-MM-DDTHH:mm:ss' sem alterar a hora
const appointmentDateTime = date.getFullYear() + '-' +
                            String(date.getMonth() + 1).padStart(2, '0') + '-' +
                            String(date.getDate()).padStart(2, '0') + 'T' +
                            String(date.getHours()).padStart(2, '0') + ':' +
                            String(date.getMinutes()).padStart(2, '0') + ':' +
                            String(date.getSeconds()).padStart(2, '0')

   await userStore.createAppointment({
    appointmentDateTime: appointmentDateTime,
    duration: '00:30:00',
    psychologistId: psychologist.value.psychologistInfo.id,
    notes: null
  }) 

  agendarAberto.value = false
  alert('Consulta agendada com sucesso!')
}


watch(dataConsulta, (newDate) => {
  if (!newDate) {
    horariosDisponiveis.value = []
    return
  }

  // Pega o dia da semana no formato JS (0 = domingo, 1 = segunda, ..., 6 = sábado)
  const jsDay = newDate.toDate('UTC').getDay()


const dayInfo = psychologist.value?.psychologistInfo?.workingHours?.find(
  (h: any) => {
    const backendDay = Number(h.dayOfWeek)        // assume que vem 0 = domingo, 1 = segunda, ..., 6 = sábado
    const convertedDay = backendDay === 0 ? 6 : backendDay - 1
    return convertedDay === jsDay
  }
)
console.log(dayInfo)
horariosDisponiveis.value = gerarHorariosDoDia(dayInfo)
console.log(horariosDisponiveis.value)

  console.log('Dia da semana (frontend):', jsDay)
  console.log('Horários disponíveis:', horariosDisponiveis.value)
})
function gerarHorariosDoDia(dayInfo: any, step = 30): string[] {
  if (!dayInfo) return []

  const { startTime, endTime, breaks = [] } = dayInfo
  const horarios: string[] = []
  let [h, m] = startTime.split(':').map(Number)
  const [endH, endM] = endTime.split(':').map(Number)

  while (h < endH || (h === endH && m < endM)) {
    const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    
    // ignora horários dentro de breaks
    const dentroDoBreak = breaks.some((b: any) => horaStr >= b.start && horaStr < b.end)
    if (!dentroDoBreak) horarios.push(horaStr)

    m += step
    if (m >= 60) {
      h += 1
      m -= 60
    }
  }

  return horarios
}

</script>  