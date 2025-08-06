<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: false })

const router = useRouter()

const tabs = ref([
  {
    label: 'Online',
    icon: 'i-lucide-video',
    description: 'Atenda via videochamada de onde estiver.'
  },
  {
    label: 'Presencial',
    icon: 'i-lucide-map-pin',
    description: 'Visite o consultório para atendimento presencial.'
  }
])

function selectOption(option: string) {
  if(option === 'Online') {
    router.push('/atendimento/online')
  } else if(option === 'Presencial') {
    router.push('/atendimento/presencial')
  }
}

// Demo data psicólogos aumentado
const psicologos = ref([
  {
    id: 1,
    name: 'Dra. Ana Martins',
    specialty: 'Ansiedade e Depressão',
    price: 150,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    type: 'online'
  },
  {
    id: 2,
    name: 'Dr. João Silva',
    specialty: 'Terapia Cognitivo-Comportamental',
    price: 180,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    type: 'presencial'
  },
  {
    id: 3,
    name: 'Dra. Carla Souza',
    specialty: 'Psicologia Infantil',
    price: 130,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    type: 'online'
  },
  {
    id: 4,
    name: 'Dr. Pedro Oliveira',
    specialty: 'Psicologia do Esporte',
    price: 170,
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    type: 'presencial'
  },
  {
    id: 5,
    name: 'Dra. Luiza Fernandes',
    specialty: 'Terapia Familiar',
    price: 140,
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    type: 'online'
  },
  {
    id: 6,
    name: 'Dr. Marcos Lima',
    specialty: 'Terapia de Casal',
    price: 160,
    avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    type: 'presencial'
  }
])

function selectPsychologist(id: number) {
  alert(`Você selecionou o psicólogo de ID: ${id}`)
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 min-h-screen flex flex-col items-center justify-center gap-10">
    <h1 class="text-4xl font-bold mb-8">Escolha o tipo de atendimento</h1>

    <UTabs :items="tabs" class="w-full max-w-5xl" :tabClass="['text-xl font-semibold py-4']">
      <template #content="{ item }">
        <div class="flex flex-col items-center p-10 w-full">

          <!-- Lista psicólogos filtrando pelo tipo da tab -->
          <div class="mt-12 w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
            <UCard 
              v-for="psicologo in psicologos.filter(p => p.type.toLowerCase() === item.label.toLowerCase())" 
              :key="psicologo.id" 
              class="cursor-pointer hover:shadow-xl transition p-6 w-full"
           
              @click="selectPsychologist(psicologo.id)"
            >
              <div class="flex items-center gap-6">
                <img :src="psicologo.avatar" alt="Avatar" class="w-20 h-20 rounded-full object-cover" />
                <div>
                  <h3 class="font-semibold text-2xl">{{ psicologo.name }}</h3>
                  <p class="text-base text-gray-700">{{ psicologo.specialty }}</p>
                  <p class="mt-2 font-semibold text-lg">R$ {{ psicologo.price.toFixed(2) }}</p>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<style scoped>
/* Customizando o tamanho das tabs via classe tabClass (se UTabs aceitar essa prop) */
</style>
