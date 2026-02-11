<template>
  <Header/>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full backdrop-blur rounded-xl shadow-lg p-8 border border-gray-200 card-hover">
      <!-- Заголовок -->
      <div class="text-center mb-8">
        <h2 class="text-2xl font-semibold text-gray-700">С возвращением!</h2>
        <p class="text-gray-500 mt-2">Войдите в семейный аккаунт</p>
      </div>

      <!-- Блок для вывода ошибок -->
      <div v-if="hasErrors" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <validation-error-component :error="errorState.validationError" />
        <auth-error-component :error="errorState.authError"/>
      </div>

      <!-- Форма логина -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-600 mb-2">Имя пользователя</label>
          <input type="text" id="username" v-model="username"
                 class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 focus:outline-none transition-colors bg-white/80"
                 placeholder="Введите ваше имя пользователя"
                 required>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-600 mb-2">Пароль</label>
          <input type="password" id="password" v-model="password"
                 class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-200 focus:outline-none transition-colors bg-white/80"
                 placeholder="Введите ваш пароль"
                 required>
        </div>

        <!-- Submit Button -->
        <button type="submit"
                class="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium">
          Войти
        </button>
      </form>

      <!-- Footer Text -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-500">Нет аккаунта?
          <a href="/cohab/registration" class="text-gray-600 hover:text-gray-800 font-medium">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script src="./Login.ts" lang="ts"></script>
