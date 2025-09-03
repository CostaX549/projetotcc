<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { ref } from 'vue'
import { usePsychologistStore } from '~/stores/psychologist'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'


definePageMeta({ layout: false })

const userStore = useUserStore()
const psychologistStore = usePsychologistStore()
const router = useRouter()
const isLoading = ref(false)
const profilePicture = ref<File | null>(null)

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    profilePicture.value = target.files[0]
  }
}


// Tabs
const items: TabsItem[] = [
  { label: 'Conta Pessoal', icon: 'i-lucide-user' },
  { label: 'Conta Profissional', icon: 'i-lucide-briefcase' }
]

// 🔹 Campos Conta Pessoal
const fieldsPessoal = [
  { name: 'name', type: 'text', label: 'Nome Completo' },
  { name: 'email', type: 'text', label: 'Email' },
  { name: 'password', type: 'password', label: 'Senha' },
  { name: 'profilePicture', type: 'file', label: 'Foto de Perfil' , accept: 'image/*',   onChange: onFileChange}
]



// 🔹 Campos Conta Profissional
const fieldsProfissional = ref([
  { name: 'clinicName', type: 'text', label: 'Nome do Consultório' },
  { name: 'email', type: 'text', label: 'Email Corporativo' },
  { name: 'phone', type: 'text', label: 'Telefone' },
 
  
  { name: 'consultationPrice', type: 'number', label: 'Preço da Consulta (R$)', min: 0, step: 0.01 },
  { name: 'password', type: 'password', label: 'Senha' },
  { name: 'profilePicture', type: 'file', label: 'Foto de Perfil' , accept: 'image/*',   onChange: onFileChange }
])






// Função de envio
async function onSubmit(payload: any, currentItem: TabsItem) {
  isLoading.value = true
  try {
    const formData = new FormData()

    if (currentItem.label === 'Conta Pessoal') {
      formData.append('username', payload.data.name)
      formData.append('email', payload.data.email)
      formData.append('password', payload.data.password)

      if (payload.data.profilePicture) {
        formData.append('profilePicture', profilePicture.value)
      }
    console.log(payload.data.profilePicture)
      const response = await userStore.register(formData)
      localStorage.setItem('access_token', response.data.accessToken)
      await userStore.getUser()
      router.push('/atendimento')

    } else if (currentItem.label === 'Conta Profissional') {
      formData.append('username', payload.data.clinicName)
      formData.append('email', payload.data.email)
      formData.append('password', payload.data.password)
      formData.append('phoneNumber', payload.data.phone)
      formData.append('consultationPrice', payload.data.consultationPrice)
      formData.append('role', 'Professional')
      if (payload.data.profilePicture) {
        formData.append('profilePicture', profilePicture.value)
      }

      const response = await psychologistStore.register(formData)
      localStorage.setItem('access_token', response.data.accessToken)
      await psychologistStore.getUser()
      router.push('/doctor/localizacao')
    }

  } catch (error: any) {
    console.error('Erro ao registrar:', error)
    alert('Ocorreu um erro ao criar a conta. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #content="{ item }">
      <UAuthForm
        class="max-w-lg mx-auto mt-8 p-2"
        :title="`Criar Conta ${item.label}`"
        description="Digite suas credenciais para criar uma conta"
        :icon="item.icon"
        :submit="{ label: 'Registrar' }"
        @submit="(payload) => onSubmit(payload, item)"
        :fields="item.label === 'Conta Pessoal' ? fieldsPessoal : fieldsProfissional"
        :loading="isLoading"
      />
      <div class="mt-4 text-center">
        <ULink to="/login">Já tem uma conta? Faça Login</ULink>
      </div>
    </template>
  </UTabs>
</template>
