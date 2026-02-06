<template>
  <div class="bg-gray-50 p-4 rounded-lg">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-500">{{ title }}</span>
      <div class="flex items-center gap-2">
        <div class="flex items-center">
          <div :class="['w-4 h-4 rounded mr-1', indicatorClass]"></div>
          <span class="text-xs" :class="indicatorTextClass">{{ indicatorText }}</span>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-1">
        <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3', bgColor]">
          {{ initials }}
        </div>
        <div class="flex-1">
          <p class="font-medium text-gray-800">{{ name }}</p>
          <p class="text-sm text-gray-500">{{ date }}</p>
        </div>
      </div>
      <div v-if="canAction" class="ml-4">
        <label class="flex items-center cursor-pointer">
          <span class="mr-2 text-sm text-gray-700 whitespace-nowrap">{{ actionText }}</span>
          <div class="relative">
            <input type="checkbox" class="sr-only" :checked="isActive" @change="$emit('action')">
            <div :class="['w-10 h-6 rounded-full transition-colors', toggleClass]"></div>
            <div :class="['absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform', isActive ? 'transform translate-x-4' : '']"></div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FamilyMember } from '@/types/family'

interface Props {
  person: FamilyMember
  title?: string
  isMarked?: boolean
  isChecked?: boolean
  canAction?: boolean
  actionType?: 'mark' | 'check'
  date?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Участник',
  actionType: 'mark'
})

const emit = defineEmits(['action'])

const isActive = computed(() => props.actionType === 'mark' ? props.isMarked : props.isChecked)
const bgColor = computed(() => props.actionType === 'mark' ? 'bg-green-500' : 'bg-blue-500')
const indicatorClass = computed(() => isActive.value ? (props.actionType === 'mark' ? 'bg-green-500' : 'bg-blue-500') : 'bg-gray-300')
const indicatorTextClass = computed(() => isActive.value ? (props.actionType === 'mark' ? 'text-green-600' : 'text-blue-600') : 'text-gray-500')
const toggleClass = computed(() => isActive.value ? (props.actionType === 'mark' ? 'bg-green-500' : 'bg-blue-500') : 'bg-gray-300')

const initials = computed(() => {
  const first = props.person.personalInfo?.firstname?.[0] || ''
  const last = props.person.personalInfo?.lastname?.[0] || ''
  return (first + last).toUpperCase() || '?'
})

const name = computed(() => {
  const first = props.person.personalInfo?.firstname || 'Не указано'
  const last = props.person.personalInfo?.lastname?.charAt(0) || 'Не указано'
  return `${first} ${last}.`
})

const indicatorText = computed(() => {
  if (props.actionType === 'mark') {
    return props.isMarked ? 'Выполнено' : 'В работе'
  }
  return props.isChecked ? 'Проверено' : 'Не проверено'
})

const actionText = computed(() => props.actionType === 'mark' ? 'Выполнено' : 'Проверено')
</script>