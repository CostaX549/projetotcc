import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'  // pega o Nuxt app para acessar axios

export const useUserStore = defineStore('user', {
  
  state: () => ({
    id: '',
    username: '',
    email: '',
    password: ''
  }),
  actions: {
    
    async login(email: string, password: string) {
      const { $axios } = useNuxtApp()  // pegar instância correta e tipada do axios

      try {
        const response = await $axios.post('/api/Auth/login', { email, password })
        return response
      } catch (error) {
        console.error('Erro ao fazer login:', error)
        throw new Error('Falha no login')
      }
    },

    async register(username: string, email: string, password: string) {
      const { $axios } = useNuxtApp()
      try {
        const response = await $axios.post('/api/Auth/register', {
          username,
          email,
          password,
          role: 'User'
        })
        return response
      } catch (error) {
        console.error('Erro ao registrar:', error)
        throw new Error('Falha ao registrar o usuário')
      }
    },

    async getUser() {
      const { $axios } = useNuxtApp()
      try {
        const res = await $axios.get('/api/Auth/user')
        const user = res.data
        if (user.role === 'User') {
          this.id = user.id
          this.username = user.username
          this.email = user.email
        }
        return user
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      }
    }
  },
  persist: true
})
