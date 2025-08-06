import axios, { AxiosHeaders } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  axios.defaults.baseURL = 'http://localhost:5257'

  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders()
        }
        config.headers.set('Authorization', `Bearer ${token}`)
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios
    }
  }
})
