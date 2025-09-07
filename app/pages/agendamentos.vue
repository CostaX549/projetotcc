<template>
  <div class="agendamentos-page">
    <h1 class="text-2xl font-bold mb-6">Meus Agendamentos</h1>

    <div v-if="loading" class="text-gray-500 dark:text-gray-400">
      Carregando agendamentos...
    </div>

    <div v-else>
      <div v-if="agendamentos.length" class="grid gap-4 md:grid-cols-2">
        <UCard
          v-for="agendamento in agendamentos"
          :key="agendamento.id"
          class="bg-white dark:bg-gray-800 shadow hover:shadow-lg transition"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Consulta com Psicólogo
              </h2>
              <UBadge color="blue" variant="subtle">{{ agendamento.status }}</UBadge>
            </div>
          </template>

          <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
            Data: {{ formatDate(agendamento.appointmentDateTime) }}
          </p>

          <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
            Duração: {{ formatDuration(agendamento.duration) }}
          </p>

          <p class="text-gray-700 dark:text-gray-300 text-sm mb-2">
            Notas: {{ agendamento.notes || 'Nenhuma anotação' }}
          </p>

          <template #footer>
            <UButton
              v-if="agendamento.videoCall"
              :to="agendamento.videoCall.meetingUrl"
              target="_blank"
              icon="i-heroicons-video-camera"
              color="primary"
              variant="solid"
              label="Entrar na Videochamada"
            />
          </template>
        </UCard>
      </div>

      <div v-else class="text-gray-500 dark:text-gray-400">
        Nenhum agendamento encontrado.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { format } from 'date-fns'

definePageMeta({ layout: 'user' })

const agendamentos = ref<any[]>([])
const loading = ref(true)
const userStore = useUserStore()

onMounted(async () => {
  try {
    loading.value = true
    const data = await userStore.fetchAppointments()
    agendamentos.value = data
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err)
  } finally {
    loading.value = false
  }
})

function formatDate(date: string) {
  const d = new Date(date)
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(d)
}

function formatDuration(duration: string) {
  const [hh, mm] = duration.split(':')
  return `${parseInt(hh)}h ${parseInt(mm)}min`
}
</script>

<style scoped>
.agendamentos-page {
  max-width: 960px;
  margin: 2rem auto;
  padding: 1rem;
}
</style>
