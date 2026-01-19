<script setup lang="ts">
import Header from "@/views/header/Header.vue";
</script>
<template>
  <Header/>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="max-w-7xl w-full">
      <div class="backdrop-blur rounded-2xl shadow-xl p-12 border border-gray-200 card-hover text-center">
        <!-- Иконка для визуального акцента -->
        <div class="mb-6 flex justify-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
        </div>

        <!-- Сообщение -->
        <p class="text-2xl font-semibold text-gray-800 mb-4">
          Попросите администратора подтвердить вашу личность
        </p>

        <p class="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          Для доступа ко всем функциям системы необходимо подтверждение администратора
        </p>

        <!-- Кнопка или дополнительная информация -->
        <div class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer">
          <span class="font-medium">Как связаться с администратором?</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>