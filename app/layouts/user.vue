<template>
  <div class="flex flex-col min-h-screen">
    <!-- Custom Navbar -->
    <header class=" shadow px-6 py-4">
      <nav class="flex justify-between items-center max-w-7xl mx-auto">
        <!-- Logo / Título -->
        <div class="flex items-center gap-2">
          <span class="text-xl font-semibold">ConectaMente</span>
        </div>

        <!-- Menu -->
        <ul class="hidden md:flex gap-6 text-sm font-medium">
          <li v-for="item in menuItems" :key="item.label">
            <button
              @click="navigate(item.route)"
              class="hover:text-primary-500 transition-colors"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>

        <!-- Right side -->
        <div class="flex items-center gap-3">
          <!-- Theme toggle (Dark/Light) -->
     
  <UUser
 
    :avatar="{
      src: userStore.profilePicture || 'https://i.pravatar.cc/150?img=3',
      icon: 'i-lucide-image'
    }"
  />
          <!-- Mobile menu (optional dropdown / burger menu) -->
          <!-- Placeholder for mobile menu -->
        </div>
      </nav>
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 p-6 overflow-y-auto">
      <slot />
    </main>

    <!-- Footer -->
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
import { useUserStore } from "~/stores/user";
import { usePsychologistStore } from "~/stores/psychologist"
const userStore = useUserStore()
const psychologistStore = usePsychologistStore()

const router = useRouter()

// Itens do menu
const menuItems = ref([
  { label: 'Home', route: '/atendimento' },
  { label: 'Agendamentos', route: '/agendamentos' },
  { label: 'Perfil', route: '/dashboard/perfil' },
  { label: 'Configurações', route: '/dashboard/configuracoes' }
])

function navigate(route: string) {
  router.push(route)
}

// Itens do footer
const footerItems: NavigationMenuItem[] = [
  { label: 'Figma Kit', to: 'https://www.figma.com/community/file/1288455405058138934', target: '_blank' },
  { label: 'Playground', to: 'https://stackblitz.com/edit/nuxt-ui', target: '_blank' },
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Releases', to: 'https://github.com/nuxt/ui/releases', target: '_blank' }
]
</script>
