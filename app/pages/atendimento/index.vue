<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '~/stores/user'

definePageMeta({ layout: 'user' })

const router = useRouter()
const userStore = useUserStore()

const tabs = ref([
  { label: 'Online', icon: 'i-lucide-video', description: 'Atenda via videochamada de onde estiver.' },
  { label: 'Presencial', icon: 'i-lucide-map-pin', description: 'Visite o consultório para atendimento presencial.' }
])

const userLocation = ref<{ lat: number, lng: number } | null>(null)

// Solicitar localização do usuário
function getUserLocation() {
  return new Promise<{ lat: number, lng: number }>((resolve, reject) => {
    if (!navigator.geolocation) return reject('Geolocalização não suportada')
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err)
    )
  })
}

// Calcula distância em km entre duas coordenadas
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  console.log(lat1, lon1, lat2, lon2)
  const R = 6371; // raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
function goToPsychologist(id: string) {
  router.push(`/psychologist/${id}`)
}
function selectPsychologist(id: number) {
  alert(`Você selecionou o psicólogo de ID: ${id}`)
}

onMounted(async () => {
  await userStore.fetchPsychologists()
  try {
    userLocation.value = await getUserLocation()

  } catch (err) {
    console.warn('Não foi possível obter localização:', err)
  }
})
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 min-h-screen flex flex-col  gap-10">
    <h1 class="text-4xl font-bold mb-8">Psicólogos Disponíveis</h1>

    <UTabs :items="tabs" class="w-full max-w-5xl" :tabClass="['text-xl font-semibold py-4']">
      <template #content="{ item }">
        <div class="flex flex-col items-center p-10 w-full">
          <!-- Lista psicólogos filtrando pelo tipo da tab -->
          <div class="mt-12 flex gap-3  ">
             <div
    v-for="psicologo in userStore.psychologists
      .filter(p => p.type === item.label)
      .map(p => {
        if (userLocation && item.label === 'Presencial') {
          p.distance = getDistanceKm(
            userLocation.lat, 
            userLocation.lng, 
            p.latitude, 
            p.longitude
          )
        }
        return p
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))"
    :key="psicologo.id"
    class="min-w-sm mx-auto bg-white dark:bg-[#1b1718] border border-gray-500 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition"
    
  >
    <!-- Header do card -->
    <div class="border-b px-4 pb-6">
      <div class="text-center my-4">
        <img
          class="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4 object-cover"
          :src="psicologo.avatar"
          :alt="psicologo.name"
        />
        <div class="py-2">
          <h3 class="font-bold text-2xl text-gray-800 dark:text-white mb-1 truncate">{{ psicologo.name }}</h3>
          <div class="inline-flex text-gray-700 dark:text-gray-300 items-center justify-center gap-1">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            </svg>
            <span>
              {{ psicologo.city || 'Local não informado' }}
              <span v-if="psicologo.distance"> -   {{ psicologo.distance.toFixed(1) }} km  </span>
            </span>
          </div>
        </div>
      </div>
      <!-- Botões -->
      <div class="flex gap-2 px-2">
        <button     @click="goToPsychologist(psicologo.id)" class="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2 cursor-pointer">
          Agendar 
        </button>
        <button class="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2 cursor-pointer">
          Mensagem
        </button>
      </div>
    </div>

    <!-- Followers conhecidos (opcional, pode mapear real) -->
    <div class="px-4 py-4">
      <div class="flex gap-2 items-center text-gray-800 dark:text-gray-300 mb-4">
        <svg class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm9 11a1 1 0 0 1-2 0v-2a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v2a1 1 0 0 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2z"/>
        </svg>
        <span>Avaliação Geral:</span>
      </div>
    </div>
  </div>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<style scoped>
/* Personalizações das tabs podem ser feitas aqui */
</style>
