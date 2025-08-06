<script setup lang="ts">
definePageMeta({
 layout: false
})
const links = ref([
  {
    label: 'Começe agora',
    to: '/login',
    icon: 'i-lucide-square-play'
  },
 
])
</script>

<template>
  <UPageHero
    title="ConectaMente"
    description="ConectaMente é uma plataforma que conecta psicólogos e pacientes de forma prática e segura."
    headline="Nova versão"
    orientation="vertical"
    :links="links"
  >
    <img
      src="~/assets/hero-img-4.webp"
      alt="App screenshot"
      class="rounded-lg shadow-2xl ring ring-default"
    />
  </UPageHero>
</template>

