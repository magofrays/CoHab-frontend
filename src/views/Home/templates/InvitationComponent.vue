<template>
    <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Приглашение создано</h3>
        <button
            @click="copyInvitation"
            class="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Копировать
        </button>
      </div>
      
      <div class="mb-4">
        <div class="mb-2">
          <span class="text-sm font-medium text-gray-500">Код приглашения</span>
        </div>
        <div class="bg-white p-4 rounded-lg border">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
            </div>
            <div>
              <p class="font-mono text-lg font-semibold text-gray-800">
                {{ invitationCode }}
              </p>
              <p class="text-sm text-gray-500">
                https://yourapp.com/join/{{ invitationCode }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Детали -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-3 rounded-lg border">
          <div class="flex items-center mb-1">
            <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.75h-7.5"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Участников</p>
              <p class="font-semibold text-gray-800">
                {{ numMembers }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white p-3 rounded-lg border">
          <div class="flex items-center mb-1">
            <div class="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Действует до</p>
              <p class="font-semibold text-gray-800">
                {{ formatDate(expiresAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">



interface Props {
  invitationCode: string,
  numMembers: number,
  expiresAt: Date

}

const props = defineProps<Props>()

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const copyInvitation = async () => {
  await navigator.clipboard.writeText(props.invitationCode);
}

</script>
