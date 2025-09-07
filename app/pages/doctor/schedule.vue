<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '#imports'
import { usePsychologistStore } from '~/stores/psychologist'

const toast = useToast()
const store = usePsychologistStore()

const daysOfWeek = [
  { id: 1, name: 'Segunda' },
  { id: 2, name: 'Terça' },
  { id: 3, name: 'Quarta' },
  { id: 4, name: 'Quinta' },
  { id: 5, name: 'Sexta' },
  { id: 6, name: 'Sábado' },
  { id: 0, name: 'Domingo' } // Domingo = 0 conforme C#
]

// Definição do tipo do schedule
type ScheduleItem = {
  enabled: boolean
  start: string
  end: string
  lunchStart: string
  lunchEnd: string
}

// Inicializa com os horários da store ou default
const schedule = ref<Partial<Record<number, ScheduleItem>>>({
  1: { enabled: false, start: '', end: '', lunchStart: '', lunchEnd: '' },
  2: { enabled: false, start: '', end: '', lunchStart: '', lunchEnd: '' },
  3: { enabled: false, start: '', end: '', lunchStart: '', lunchEnd: '' },
  4: { enabled: false, start: '', end: '', lunchStart: '', lunchEnd: '' },
  5: { enabled: false, start: '', end: '', lunchStart: '', lunchEnd: '' },
  6: { enabled: false, start: '', end: '', lunchStart: '', lunchEnd: '' },
  0: { enabled: false, start: '', end: '', lunchStart: '', lunchEnd: '' }
})

onMounted(() => {
  daysOfWeek.forEach(day => {
    const workingHour = store.workingHours.find(h => h.dayOfWeek === day.id)
    schedule.value[day.id] = workingHour
      ? {
          enabled: true,
          start: workingHour.startTime,
          end: workingHour.endTime,
          lunchStart: workingHour.breaks?.[0]?.start || '',
          lunchEnd: workingHour.breaks?.[0]?.end || ''
        }
      : { enabled: false, start: '', end: '', lunchStart: '', lunchEnd: '' }
  })
})

async function saveScheduleHandler() {
  // Transformar schedule.value em WorkingHourDto[]
  const scheduleToSave = daysOfWeek
    .filter(day => schedule.value[day.id]?.enabled)
    .map(day => ({
      id: '', // Pode ser preenchido se tiver IDs no backend
      dayOfWeek: day.id,
      startTime: schedule.value[day.id]!.start,
      endTime: schedule.value[day.id]!.end,
      breaks: schedule.value[day.id]!.lunchStart
        ? [{ start: schedule.value[day.id]!.lunchStart, end: schedule.value[day.id]!.lunchEnd }]
        : []
    }))
console.log(scheduleToSave)
  try {
    await store.saveSchedule(scheduleToSave)
    toast.add({
      title: 'Horários salvos com sucesso!',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Erro ao salvar horários',
      color: 'error'
    })
  }
}
</script>

<template>
  <UContainer class="py-8">
    <h1 class="text-2xl font-bold mb-6">Gerenciar horários de trabalho</h1>

    <UCard class="max-h-[85vh] overflow-y-auto">
      <div class="space-y-6">
        <div
          v-for="day in daysOfWeek"
          :key="day.id"
          class="border-b border-gray-200 pb-4"
        >
          <div class="flex items-center gap-3 mb-3">
            <UCheckbox v-model="schedule[day.id]!.enabled" :label="day.name" />
          </div>

          <div
            v-if="schedule[day.id]!.enabled"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <UInput v-model="schedule[day.id]!.start" type="time" label="Início" />
            <UInput v-model="schedule[day.id]!.end" type="time" label="Fim" />
            <UInput v-model="schedule[day.id]!.lunchStart" type="time" label="Início almoço" />
            <UInput v-model="schedule[day.id]!.lunchEnd" type="time" label="Fim almoço" />
          </div>
        </div>

        <div class="flex justify-end">
          <UButton color="primary" @click="saveScheduleHandler">Salvar</UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>
