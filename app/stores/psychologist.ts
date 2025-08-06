import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'


interface PsychologistState {
  id: string
  username: string
  description: string
  consultationPrice: string
  city: string
  state: string
  postalCode: string
  phoneNumber: string
  address: string
}

export const usePsychologistStore = defineStore('psychologist', {
  state: (): PsychologistState => ({
    id: '',
    username: '',
    description: '',
    consultationPrice: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    address: ''
  }),

  actions: {
    async login(email: string, password: string): Promise<void> {
      const { $axios } = useNuxtApp()
      await $axios.post('/api/Auth/login', { email, password })
    },

    async register(
      name: string,
      email: string,
      password: string,
      phoneNumber: string,
      consultationPrice: string,
      role: string
    ): Promise<any> {
      const { $axios } = useNuxtApp()
      const response = await $axios.post('/api/Auth/register', {
        username: name,
        email,
        password,
        phoneNumber,
        consultationPrice,
        role
      })
      return response
    },

    async getUser(): Promise<any> {
      const { $axios } = useNuxtApp()
      try {
        const res = await $axios.get('/api/Auth/user')
        const user = res.data
        if (user.role === 'Professional') {
          this.id = user.id
          this.username = user.username
          this.description = user.description
          this.consultationPrice = user.consultationPrice
          this.city = user.city
          this.state = user.state
          this.postalCode = user.postalCode
          this.phoneNumber = user.phoneNumber
          this.address = user.address
        }
        return user
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      }
    }
  },

  persist: true
})
