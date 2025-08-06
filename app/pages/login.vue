<script setup lang="ts">
definePageMeta({ layout: false })
useSeoMeta({
  title: 'Login',
  description: 'Faça login na sua conta ConectaMente'
})
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useUserStore } from '~/stores/user'
import { usePsychologistStore } from '~/stores/psychologist'
const isLoading = ref(false)
const fields = ref([
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
])
const userStore = useUserStore()
const psychologistStore = usePsychologistStore()
const router = useRouter()
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})
type Schema = z.output<typeof schema>
async function onSubmit(payload: FormSubmitEvent<Schema>) {
    isLoading.value = true
   try {
    const response = await userStore.login(payload.data.email, payload.data.password)
 
      localStorage.setItem('access_token', response.data.accessToken)
  
    const user = await userStore.getUser()
    if (user.role === 'Professional') {

     await psychologistStore.getUser()
      router.push('/doctor')
    } else {
      router.push('/atendimento')
    }
  } catch (error) {
    console.error('Erro ao registrar:', error)
    alert('Ocorreu um erro ao criar a conta. Tente novamente.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen flex-col">
    <UAuthForm
      :schema="schema"
      class="w-full max-w-lg p-2"
      title="Login"
      description="Digite suas credenciais para criar uma conta."
      icon="i-lucide-user"
           :submit="{
      label: 'Login',
   
      
    }"
      :fields="fields"
       @submit="onSubmit"
      :loading="isLoading"
    />
      <div class="mt-4 text-center">
        <ULink to="/register">Não tem uma conta? Cadastre-se</ULink>
    </div>
  </div>
</template>
