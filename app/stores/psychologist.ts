import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

interface PsychologistState {
  id: string
  username: string
  description: string
  consultationPrice: string,
  profilePicture: string,
  city: string
  state: string
  postalCode: string
  phoneNumber: string
  address: string
  workingHours: WorkingHourDto[] // adicionando os horários aqui
}

interface ConsultationType {
  label: string
  value: string
}

interface BreakPeriodDto {
  start: string
  end: string
}

interface WorkingHourDto {
  id: string
  dayOfWeek: number // ou DayOfWeek
  startTime: string
  endTime: string
  breaks: BreakPeriodDto[]
}

export const usePsychologistStore = defineStore('psychologist', {
  state: (): PsychologistState => ({
    id: '',
    username: '',
    description: '',
    profilePicture: '',
    consultationPrice: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    address: '',
    workingHours: []
  }),

  actions: {
    async login(email: string, password: string): Promise<void> {
      const { $axios } = useNuxtApp()
      await $axios.post('/api/Auth/login', { email, password })
    },

    async register(formData: FormData): Promise<any> {
      const { $axios } = useNuxtApp()
      const response = await $axios.post('/api/Auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
          this.profilePicture = user.profilePicture || ''
          this.city = user.city
          this.state = user.state
          this.postalCode = user.postalCode
          this.phoneNumber = user.phoneNumber
          this.address = user.address
          this.workingHours = user.workingHours || []
        }
        return user
      } catch (error) {
        console.error('Erro ao buscar usuário:', error)
      }
    },

    async updateLocation(
      stateValue: string,
      cityValue: string,
      cepValue: string,
      streetNumberValue: string,
      lat: number | null,
      lon: number | null,
      consultationType: ConsultationType | null
    ) {
      const { $axios } = useNuxtApp()
      try {
        const response = await $axios.post('/api/Auth/update-location', {
          state: stateValue,
          city: cityValue,
          cep: cepValue,
          streetNumber: streetNumberValue,
          latitude: lat,
          longitude: lon,
          consultationType: consultationType?.value
        })

        this.state = stateValue
        this.city = cityValue
        this.postalCode = cepValue
        this.address = streetNumberValue

        return response.data
      } catch (error) {
        console.error('Erro ao salvar localização:', error)
      }
    },

    // ✅ Nova função para salvar horários de trabalho
    async saveSchedule(schedule) {
      const { $axios } = useNuxtApp()
      try {
        const response = await $axios.post('/api/Auth/workinghours',  schedule )
        // Atualizar store local
        this.workingHours = schedule
        return response.data
      } catch (error) {
        console.error('Erro ao salvar horários de trabalho:', error)
      }
    }
  },

  persist: true
})
