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
interface ConsultationType {
 label: string,
 value: string
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

 async register(formData: FormData): Promise<any> {
  const { $axios } = useNuxtApp()

  const response = await $axios.post('/api/Auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
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
    },

    // ✅ Nova função para salvar a localização
    async updateLocation(stateValue: string, cityValue: string, cepValue: string, streetNumberValue: string, lat: number|null, lon: number|null, consultationType: ConsultationType | null) {
      const { $axios } = useNuxtApp()
    console.log(consultationType);
  
        try {
          const response = await $axios.post(
            '/api/Auth/update-location',
            {
              state: stateValue,
              city: cityValue,
              cep: cepValue,
              streetNumber: streetNumberValue,
                 latitude: lat,
            longitude: lon,
            consultationType: consultationType?.value
            },
            
          )

          // Atualizar store com os novos valores
          this.state = stateValue
          this.city = cityValue
          this.postalCode = cepValue
          this.address = streetNumberValue

          return response.data
        } catch (error) {
          console.error('Erro ao salvar localização:', error)
        }
      
    }
  },

  persist: true
})
