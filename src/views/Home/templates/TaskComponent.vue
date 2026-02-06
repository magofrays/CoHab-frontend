<template>
  <div :class="taskClasses">
    <!-- Заголовок -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
            #{{ task.value.id.slice(0, 8) }}
          </span>
          <div class="flex items-center gap-2">
            <div :class="statusIcon('isMarked', 'green')">
              <svg v-if="task.value.isMarked" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
              <span v-else class="text-xs">✓</span>
            </div>
            <div :class="statusIcon('isChecked', 'blue')">
              <svg v-if="task.value.isChecked" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span v-else class="text-xs">✓</span>
            </div>
            <span :class="statusBadgeClasses">{{ statusText }}</span>
          </div>
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">{{ task.value.taskName }}</h3>
        <p v-if="task.value.description" class="text-gray-600 mb-4">{{ task.value.description }}</p>
      </div>
      <div class="w-32 ml-4">
        <div class="mb-2">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>Срок</span>
            <span :class="{'text-red-600 font-semibold': isOverdue}">{{ timeLeft }}</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div :class="progressBarClasses" :style="{ width: `${Math.min(deadlineProgress, 100)}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о задаче -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <PersonCard
          :person="task.value.createdBy"
          :is-checked="task.value.isChecked"
          :can-action="canCheckTask"
          action-type="check"
          @action="$emit('check-task', task, !task.value.isChecked)"
      />
      <PersonCard
          :person="task.value.issuedTo"
          :is-marked="task.value.isMarked"
          :can-action="canMarkTask && !task.value.isChecked"
          action-type="mark"
          @action="$emit('mark-task', task, !task.value.isMarked)"
      />
    </div>

    <!-- Действия -->
    <div class="flex flex-wrap gap-4 text-sm">
      <div class="flex items-center">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-gray-600">Создана: {{ formatDate(task.value.createdDate) }}</span>
      </div>

      <div class="flex items-center">
        <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span :class="{'text-red-600 font-semibold': isOverdue, 'text-gray-600': !isOverdue}">
          Дедлайн: {{ formatDate(task.value.dueDate) }}
        </span>
      </div>

      <div class="ml-auto flex gap-2">
        <button @click="$emit('edit-task', task)" class="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-2 rounded-lg font-medium transition-colors flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Редактировать
        </button>

        <button @click="$emit('delete-task', task)" class="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg font-medium transition-colors flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import type { Task } from '@/types/task'
import PersonCard from '@/views/Home/templates/PersonCard.vue'

interface Props {
  task: Ref<Task>
  currentUserId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'mark-task': [task: Ref<Task>, isMarked: boolean]
  'check-task': [task: Ref<Task>, isChecked: boolean]
  'edit-task': [task: Ref<Task>]
  'delete-task': [task: Ref<Task>]
}>()

const now = ref(new Date())

onMounted(() => {
  setInterval(() => now.value = new Date(), 60000)
})

// Computed
const isOverdue = computed(() => new Date(props.task.value.dueDate) < now.value)
const deadlineProgress = computed(() => {
  const created = new Date(props.task.value.createdDate).getTime()
  const due = new Date(props.task.value.dueDate).getTime()
  const current = now.value.getTime()
  if (current >= due) return 100
  if (current <= created) return 0
  return ((current - created) / (due - created)) * 100
})

const timeLeft = computed(() => {
  const diff = new Date(props.task.value.dueDate).getTime() - now.value.getTime()
  if (diff <= 0) return 'Просрочено'
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return days > 0 ? `Осталось ${days} дн. ${hours} ч.` : `Осталось ${hours} часов`
})

const canMarkTask = computed(() => props.currentUserId === props.task.value.issuedTo.id)
const canCheckTask = computed(() => props.currentUserId === props.task.value.createdBy.id)

// CSS Classes
const taskClasses = computed(() => [
  'task-item p-6 rounded-xl border-2 transition-all duration-300',
  isOverdue.value ? 'border-red-300 bg-red-50' :
      props.task.value.isMarked && props.task.value.isChecked ? 'border-green-300 bg-green-50' :
          props.task.value.isMarked ? 'border-blue-300 bg-blue-50' :
              !props.task.value.isMarked && !isOverdue.value ? 'border-yellow-300 bg-yellow-50' :
                  'border-gray-200 bg-white'
])

const progressBarClasses = computed(() => [
  'h-full transition-all duration-500',
  deadlineProgress.value <= 20 ? 'bg-green-500' :
      deadlineProgress.value <= 50 ? 'bg-yellow-500' : 'bg-red-500'
])

const statusText = computed(() => {
  if (isOverdue.value) return 'ПРОСРОЧЕНО'
  if (props.task.value.isMarked && props.task.value.isChecked) return 'ВЫПОЛНЕНО'
  if (props.task.value.isMarked) return 'НА ПРОВЕРКЕ'
  return 'В РАБОТЕ'
})

const statusBadgeClasses = computed(() => {
  const base = 'text-xs font-semibold px-2 py-1 rounded'
  if (isOverdue.value) return `${base} text-red-600 bg-red-100`
  if (props.task.value.isMarked && props.task.value.isChecked) return `${base} text-green-600 bg-green-100`
  if (props.task.value.isMarked) return `${base} text-blue-600 bg-blue-100`
  return `${base} text-yellow-600 bg-yellow-100`
})

// Helpers
const statusIcon = (field: 'isMarked' | 'isChecked', color: string) => [
  'w-6 h-6 rounded-full flex items-center justify-center border-2',
  props.task.value[field]
      ? `bg-${color}-100 text-${color}-600 border-${color}-300`
      : 'bg-gray-100 text-gray-400 border-gray-300'
]

const formatDate = (date: Date | string) => {
  if (!date) return 'Не указана'
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
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