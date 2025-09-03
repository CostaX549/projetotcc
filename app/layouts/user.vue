<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar / Sidebar -->
    <UDashboardNavbar
      title="Dashboard"
      :toggle="{ color: 'primary', variant: 'subtle', class: 'rounded-full' }"
      :menu="menuItems"
      @select="navigate"
    />

    <!-- Conteúdo principal ocupa todo espaço restante -->
    <main class="flex-1 p-6 overflow-y-auto">
      <slot />
    </main>

    <!-- Footer sempre no final -->
    <UFooter>
      <template #left>
        <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
      </template>

      <UNavigationMenu :items="footerItems" variant="link" />

      <template #right>
        <UButton
          icon="i-simple-icons-discord"
          color="neutral"
          variant="ghost"
          to="https://chat.nuxt.dev"
          target="_blank"
          aria-label="Discord"
        />
        <UButton
          icon="i-simple-icons-x"
          color="neutral"
          variant="ghost"
          to="https://x.com/nuxt_js"
          target="_blank"
          aria-label="X"
        />
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/nuxt"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { NavigationMenuItem } from '@nuxt/ui'

const router = useRouter()

// Menu lateral / navbar
const menuItems = ref([
  { label: 'Home', route: '/dashboard/home' },
  { label: 'Atendimentos', route: '/dashboard/atendimentos' },
  { label: 'Perfil', route: '/dashboard/perfil' },
  { label: 'Configurações', route: '/dashboard/configuracoes' }
])

function navigate(route: string) {
  router.push(route)
}

// Footer links
const footerItems: NavigationMenuItem[] = [
  { label: 'Figma Kit', to: 'https://www.figma.com/community/file/1288455405058138934', target: '_blank' },
  { label: 'Playground', to: 'https://stackblitz.com/edit/nuxt-ui', target: '_blank' },
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Releases', to: 'https://github.com/nuxt/ui/releases', target: '_blank' }
]
</script>
