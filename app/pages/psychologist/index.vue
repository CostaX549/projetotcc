<template>
  <UContainer class="py-10">
    <UCard class="max-w-4xl mx-auto p-6">
      <div class="flex flex-col md:flex-row gap-6 items-center">
        <!-- FOTO DE PERFIL -->
        <img
          :src="psicologo.foto"
          alt="Foto do Psicólogo"
          class="w-32 h-32 rounded-full object-cover shadow-md"
        />

        <!-- INFOS -->
        <div class="flex-1">
          <h1 class="text-3xl font-bold mb-1">{{ psicologo.nome }}</h1>
          <p class="text-gray-500">{{ psicologo.crp }}</p>
          <p class="mt-4 ">{{ psicologo.bio }}</p>

          <div class="mt-6 space-y-2 text-sm text-gray-600">
            <p><strong>Especialidades:</strong> {{ psicologo.especialidades.join(', ') }}</p>
            <p><strong>Atendimento:</strong> {{ psicologo.atendimento.join(', ') }}</p>
            <p><strong>Contato:</strong> {{ psicologo.contato.email }} • {{ psicologo.contato.telefone }}</p>
          </div>

          <!-- BOTÃO DE AÇÃO -->
          <div class="mt-6">
            <UButton @click="agendarAberto = true">Agendar Consulta</UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- MODAL DE AGENDAMENTO -->
    <UModal
      v-model:open="agendarAberto"
      title="Agendar Consulta"
      description="Preencha os dados para solicitar o agendamento."
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <form class="space-y-4">
          <UFormGroup label="Nome completo">
            <UInput placeholder="Seu nome" />
          </UFormGroup>

          <UFormGroup label="Data preferida">
            <UInput type="date" />
          </UFormGroup>

          <UFormGroup label="Tipo de atendimento">
            <USelect :options="['Online', 'Presencial']" />
          </UFormGroup>
        </form>
      </template>

      <template #footer="{ close }">
        <UButton label="Cancelar" color="neutral" variant="outline" @click="close" />
        <UButton label="Confirmar" color="primary" />
      </template>
    </UModal>
  </UContainer>
</template>


<script lang="ts" setup>
definePageMeta({ layout: false })

const psicologo = {
  nome: 'Dra. Ana Martins',
  crp: 'CRP 06/123456',
  foto: 'https://i.pravatar.cc/300?img=47', // imagem aleatória
  bio: 'Atua com abordagem cognitivo-comportamental, focando em ansiedade, depressão e desenvolvimento pessoal. Atendimento empático e individualizado.',
  especialidades: ['Ansiedade', 'Depressão', 'Terapia de Casal'],
  atendimento: ['Online', 'Presencial'],
  contato: {
    telefone: '(11) 98765-4321',
    email: 'ana.martins@exemplo.com',
  },
}

const agendarAberto = ref(false)
</script>

<style scoped>
/* Se quiser estilizar algo específico */
</style>
