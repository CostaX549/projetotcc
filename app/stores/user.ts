import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'  // pega o Nuxt app para acessar axios

export const useUserStore = defineStore('user', {
  
  state: () => ({
    id: '',
    username: '',
    email: '',
    password: '',
        psychologists: [] as any[],
            loading: false,
                psychologistInfo: null as any | null
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

  async register(formData: FormData) {
  const { $axios } = useNuxtApp()
  try {
    const response = await $axios.post('/api/Auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    console.error('Erro ao registrar:', error)
    throw new Error('Falha ao registrar o usuário')
  }
},
async fetchPsychologists() {
      this.loading = true
      try {
          const { $axios } = useNuxtApp()
        const response = await $axios.get('/api/Auth/psychologists')
        console.log(response.data)
        this.psychologists = response.data.map((p: any) => ({
          id: p.id,
          name: p.username,
          specialty: p.psychologistInfo?.Description || 'Geral',
          price: p.psychologistInfo?.consultationPrice || 0,
          avatar: p.profilePicture || 'https://via.placeholder.com/150',
          type: p.psychologistInfo?.type || 'online',
          latitude: p.psychologistInfo?.latitude || null,
          longitude: p.psychologistInfo?.longitude || null,
          city: p.psychologistInfo?.city || 'Localização não informada',
        }))
      } catch (error) {
        console.error('Erro ao carregar psicólogos:', error)
      } finally {
        this.loading = false
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
    },
     async fetchPsychologistInfo(userId: string) {
      const { $axios } = useNuxtApp()
      try {
        const response = await $axios.get(`/api/Auth/psychologist-info/${userId}`)
        this.psychologistInfo = response.data
        return response.data
      } catch (error: any) {
        console.error("Erro ao buscar informações do psicólogo:", error)
        throw error
      }
    }
  },
  persist: true
})
