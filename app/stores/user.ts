import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'  // pega o Nuxt app para acessar axios

export const useUserStore = defineStore('user', {
  
  state: () => ({
    id: '',
    username: '',
    email: '',
    password: '',
    profilePicture: '',
        psychologists: [] as any[],
            loading: false,
                psychologistInfo: null as any | null
  }),
  actions: {
    
    async login(email: string, password: string) {
  const { $axios } = useNuxtApp()

  // Monta o FormData
  const formData = new FormData()
  formData.append('email', email)
  formData.append('password', password)

  // Só pra debugar o que está enviando (não dá pra imprimir FormData direto, tem que iterar)
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`)
  }

  try {
    // Envia o formData sem setar Content-Type, o browser faz isso automaticamente com boundary correto
    const response = await $axios.post('/api/Auth/login', formData)
    return response
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw new Error('Falha no login')
  }
},

async createAppointment(payload: {
  appointmentDateTime: string, // ISO string
  duration: string,            // ex: "00:30:00"
  psychologistId: string,
  notes?: string | null
}) {
  const { $axios } = useNuxtApp()
  try {
    const response = await $axios.post('/api/Appointments', payload)
    return response.data
  } catch (error) {
    console.error('Erro ao criar consulta:', error)
    throw new Error('Falha ao agendar a consulta')
  }
},
  async register(formData: FormData) {
  const { $axios } = useNuxtApp()
  try {
    console.log(formData)
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
async fetchAppointments() {
  const { $axios } = useNuxtApp()
  try {
    const response = await $axios.get('/api/Appointments')
    return response.data // lista de agendamentos
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    throw new Error('Falha ao buscar agendamentos')
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
          this.profilePicture = user.profilePicture || ''
        }
        return user
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      }
    },
async getVideoCall(appointmentId: string) {
    const { $axios } = useNuxtApp()
  const res = await $axios.get(`/api/VideoCalls/appointment/${appointmentId}`)
  return res.data
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
