<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { ref } from 'vue'

import { useUserStore } from '~/stores/user'
import { usePsychologistStore } from '~/stores/psychologist'

definePageMeta({
  layout: false
})
useSeoMeta({
  title: 'Registrar',
  description: 'Crie sua conta ConectaMente',
})

const userStore = useUserStore()
const psychologistStore = usePsychologistStore()
const isLoading = ref(false)

const items: TabsItem[] = [
  {
    label: 'Conta Pessoal',
    icon: 'i-lucide-user'
  },
  {
    label: 'Conta Profissional',
    icon: 'i-lucide-briefcase'
  }
]

const fieldsPessoal = [
  {
    name: 'name',
    type: 'text',
    label: 'Nome Completo'
  },
  {
    name: 'email',
    type: 'text',
    label: 'Email'
  },
  {
    name: 'password',
    type: 'password',
    label: 'Senha'
  }
]

const fieldsProfissional = [
  {
    name: 'clinicName',
    type: 'text',
    label: 'Nome do Consultório'
  },
  {
    name: 'email',
    type: 'text',
    label: 'Email Corporativo'
  },
  {
    name: 'phone',
    type: 'text',
    label: 'Telefone'
  },
 
  {
    name: 'consultationPrice',
    type: 'number',
    label: 'Preço da Consulta (R$)',
    min: 0,
    step: 0.01
  },
  {
    name: 'password',
    type: 'password',
    label: 'Senha'
  }
]

async function onSubmit(payload: any, currentItem: TabsItem) {
  isLoading.value = true
  const router = useRouter()
  try {
    if (currentItem.label === 'Conta Pessoal') {
     const response = await userStore.register(payload.data.name, payload.data.email, payload.data.password)
       localStorage.setItem('access_token', response.data.accessToken)
       await userStore.getUser()
       router.push('/atendimento')
    } else if (currentItem.label === 'Conta Profissional') {
     const response = await psychologistStore.register(payload.data.clinicName, payload.data.email, payload.data.password, payload.data.phone,  payload.data.consultationPrice, 'Professional')
   
     localStorage.setItem('access_token', response.data.accessToken)
       await psychologistStore.getUser() 
    router.push('/doctor')
    } else {
      throw new Error('Tipo de conta inválido.')
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
        class="max-w-lg mx-auto mt-8  p-2"
        :title="`Criar Conta ${item.label}`"
        description="Digite suas credenciais para criar uma conta"
        :icon="item.icon"
          :submit="{
      label: 'Registrar',
   
      
    }"
     @submit="(payload) => onSubmit(payload, item)"
        :fields="item.label === 'Conta Pessoal' ? fieldsPessoal : fieldsProfissional"
        :loading="isLoading"
      />
      <div class="mt-4 text-center">
        <ULink to="/login">Não tem uma conta? Faça Login</ULink>
    </div>
    </template>
  </UTabs>
</template>
