<template>
  <div :class="[
    'task-item p-6 rounded-xl border-2 transition-all duration-300',
    {
      'border-red-300 bg-red-50': isOverdue,
      'border-green-300 bg-green-50': task.isMarked && task.isChecked,
      'border-blue-300 bg-blue-50': task.isMarked && !task.isChecked,
      'border-yellow-300 bg-yellow-50': !task.isMarked && !isOverdue,
      'border-gray-200 bg-white': !isOverdue
    }
  ]">
    <!-- Заголовок задачи -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <!-- ID задачи -->
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
            #{{ task.id.slice(0, 8) }}
          </span>

          <!-- Статус задачи с иконками -->
          <div class="flex items-center gap-2">
            <!-- Галочка выполнения -->
            <div :class="[
              'w-6 h-6 rounded-full flex items-center justify-center',
              task.isMarked
                ? 'bg-green-100 text-green-600 border-2 border-green-300'
                : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
            ]">
              <svg v-if="task.isMarked" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else class="text-xs">✓</span>
            </div>

            <!-- Галочка проверки -->
            <div :class="[
              'w-6 h-6 rounded-full flex items-center justify-center',
              task.isChecked
                ? 'bg-blue-100 text-blue-600 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
            ]">
              <svg v-if="task.isChecked" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span v-else class="text-xs">✓</span>
            </div>

            <!-- Текстовые статусы -->
            <span v-if="isOverdue" class="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
              ПРОСРОЧЕНО
            </span>
            <span v-else-if="task.isMarked && task.isChecked"
                  class="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
              ВЫПОЛНЕНО
            </span>
            <span v-else-if="task.isMarked"
                  class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
              НА ПРОВЕРКЕ
            </span>
            <span v-else
                  class="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
              В РАБОТЕ
            </span>
          </div>
        </div>

        <!-- Название задачи -->
        <h3 class="text-xl font-bold text-gray-800 mb-2">
          {{ task.taskName }}
        </h3>

        <!-- Описание -->
        <p v-if="task.description" class="text-gray-600 mb-4">
          {{ task.description }}
        </p>
      </div>

      <!-- Прогресс дедлайна -->
      <div class="w-32 ml-4">
        <div class="mb-2">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Срок</span>
            <span :class="{'text-red-600 font-semibold': isOverdue}">
              {{ timeLeft }}
            </span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                :class="[
                'h-full transition-all duration-500',
                {
                  'bg-red-500': deadlineProgress <= 20,
                  'bg-yellow-500': deadlineProgress > 20 && deadlineProgress <= 50,
                  'bg-green-500': deadlineProgress > 50
                }
              ]"
                :style="{ width: `${Math.min(deadlineProgress, 100)}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о задаче -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Создатель задачи -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">Постановщик</span>
          <div class="flex items-center gap-2">
            <!-- Индикатор проверки -->
            <div class="flex items-center">
              <div :class="[
                'w-4 h-4 rounded mr-1',
                task.isChecked ? 'bg-blue-500' : 'bg-gray-300'
              ]"></div>
              <span class="text-xs" :class="task.isChecked ? 'text-blue-600' : 'text-gray-500'">
                {{ task.isChecked ? 'Проверено' : 'Не проверено' }}
              </span>
            </div>

            <!-- Кнопка проверки -->
            <button
                v-if="!task.isChecked && canCheckTask"
                @click="$emit('check-task', task.id)"
                class="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full font-medium transition-colors flex items-center"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Проверить
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {{ getInitials(task.createdBy) }}
          </div>
          <div>
            <p class="font-medium text-gray-800">
              {{ formatMemberName(task.createdBy) }}
            </p>
            <p class="text-sm text-gray-500">{{ formatDate(task.createdDate) }}</p>
          </div>
        </div>
      </div>

      <!-- Исполнитель задачи -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-500">Исполнитель</span>
          <div class="flex items-center gap-2">
            <!-- Индикатор выполнения -->
            <div class="flex items-center">
              <div :class="[
                'w-4 h-4 rounded mr-1',
                task.isMarked ? 'bg-green-500' : 'bg-gray-300'
              ]"></div>
              <span class="text-xs" :class="task.isMarked ? 'text-green-600' : 'text-gray-500'">
                {{ task.isMarked ? 'Выполнено' : 'В работе' }}
              </span>
            </div>

            <!-- Кнопка выполнения -->
            <button
                v-if="!task.isMarked && canMarkTask"
                @click="$emit('mark-task', task.id)"
                class="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full font-medium transition-colors flex items-center"
            >
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Выполнил
            </button>
          </div>
        </div>
        <div class="flex items-center">
          <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
            {{ getInitials(task.issuedTo) }}
          </div>
          <div>
            <p class="font-medium text-gray-800">
              {{ formatMemberName(task.issuedTo) }}
            </p>
            <p class="text-sm text-gray-500">До: {{ formatDate(task.dueDate) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Статусы в отдельной строке -->
    <div class="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-2">
            <svg v-if="task.isMarked" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500">Выполнение</p>
            <p :class="task.isMarked ? 'text-green-600 font-medium' : 'text-gray-600'">
              {{ task.isMarked ? 'Задача выполнена' : 'Ожидает выполнения' }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-2">
            <svg v-if="task.isChecked" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-500">Проверка</p>
            <p :class="task.isChecked ? 'text-blue-600 font-medium' : 'text-gray-600'">
              {{ task.isChecked ? 'Проверено' : 'Ожидает проверки' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Чекбоксы для быстрого управления -->
      <div class="flex items-center space-x-4" v-if="canMarkTask || canCheckTask">
        <label v-if="canMarkTask" class="flex items-center cursor-pointer">
          <div class="relative">
            <input
                type="checkbox"
                class="sr-only"
                :checked="task.isMarked"
                @change="$emit('mark-task', task.id)"
            >
            <div :class="[
              'w-10 h-6 rounded-full transition-colors',
              task.isMarked ? 'bg-green-500' : 'bg-gray-300'
            ]"></div>
            <div :class="[
              'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
              task.isMarked ? 'transform translate-x-4' : ''
            ]"></div>
          </div>
          <span class="ml-2 text-sm text-gray-700">Выполнено</span>
        </label>

        <label v-if="canCheckTask" class="flex items-center cursor-pointer">
          <div class="relative">
            <input
                type="checkbox"
                class="sr-only"
                :checked="task.isChecked"
                @change="$emit('check-task', task.id)"
            >
            <div :class="[
              'w-10 h-6 rounded-full transition-colors',
              task.isChecked ? 'bg-blue-500' : 'bg-gray-300'
            ]"></div>
            <div :class="[
              'absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform',
              task.isChecked ? 'transform translate-x-4' : ''
            ]"></div>
          </div>
          <span class="ml-2 text-sm text-gray-700">Проверено</span>
        </label>
      </div>
    </div>

    <!-- Детали задачи -->
    <div class="flex flex-wrap gap-4 text-sm">
      <div class="flex items-center">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-gray-600">Создана: {{ formatDate(task.createdDate) }}</span>
      </div>

      <div class="flex items-center">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span :class="{'text-red-600 font-semibold': isOverdue, 'text-gray-600': !isOverdue}">
          Дедлайн: {{ formatDate(task.dueDate) }}
        </span>
      </div>

      <!-- Действия -->
      <div class="ml-auto flex gap-2">
        <button
            @click="$emit('edit-task', task.id)"
            class="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Редактировать
        </button>

        <button
            @click="$emit('delete-task', task.id)"
            class="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Task, FamilyMember } from '@/types/task'

interface Props {
  task: Task
  currentUserId?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'mark-task': [id: string]
  'check-task': [id: string]
  'edit-task': [id: string]
  'delete-task': [id: string]
}>()

const now = ref(new Date())

onMounted(() => {
  const interval = setInterval(() => {
    now.value = new Date()
  }, 60000)
  return () => clearInterval(interval)
})

const isOverdue = computed(() => {
  return new Date(props.task.dueDate) < now.value
})

const deadlineProgress = computed(() => {
  const created = new Date(props.task.createdDate).getTime()
  const due = new Date(props.task.dueDate).getTime()
  const current = now.value.getTime()

  if (current >= due) return 100
  if (current <= created) return 0

  const total = due - created
  const elapsed = current - created
  return (elapsed / total) * 100
})

const timeLeft = computed(() => {
  const due = new Date(props.task.dueDate)
  const diffMs = due.getTime() - now.value.getTime()

  if (diffMs <= 0) return 'Просрочено'

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffDays > 0) {
    return `Осталось ${diffDays} дн. ${diffHours} ч.`
  } else if (diffHours > 0) {
    return `Осталось ${diffHours} часов`
  } else {
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `Осталось ${diffMinutes} минут`
  }
})

const canMarkTask = computed(() => {
  return props.currentUserId === props.task.issuedTo.id
})

const canCheckTask = computed(() => {
  return props.currentUserId === props.task.createdBy.id
})

const getInitials = (member: FamilyMember): string => {
  const firstName = member.personalInfo?.firstname?.[0] || ''
  const lastName = member.personalInfo?.lastname?.[0] || ''
  return (firstName + lastName).toUpperCase() || '?'
}

const formatMemberName = (member: FamilyMember): string => {
  const firstName = member.personalInfo?.firstname || 'Не указано'
  const lastName = member.personalInfo?.lastname || 'Не указано'
  return `${firstName} ${lastName}`
}

const formatDate = (date: Date | string): string => {
  if (!date) return 'Не указана'
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.task-item {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>