import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Family, FamilyMember } from "@/types/family.ts"
import type {Task} from "@/types/task.ts"

const useFamilyStore = defineStore('family', () => {
    // Используем ref для реактивных данных
    const families = ref<Record<string, Family>>({})
    const profiles = ref<Record<string, FamilyMember>>({})
    const familiesLoaded = ref<boolean>(false)
    const members = ref<Record<string, FamilyMember[]>>({})
    const tasks = ref<Record<string, Task[]>>({})

    function loadMembers(familyMembers: FamilyMember[]) {
        if (familyMembers.length > 0) {
            const firstMember = familyMembers[0]
            if (firstMember?.family?.id) {
                members.value[firstMember.family.id] = familyMembers
            }
        }
    }

    function loadTasks(loadedTasks: Task[], familyId: string) {
        if(loadedTasks.length > 0) {
            tasks.value[familyId] = loadedTasks
        }
    }

    function loadFamilies(familyMembers: FamilyMember[]) {
        familyMembers.forEach(profile => {
            profiles.value[profile.family.id] = profile
            families.value[profile.family.id] = profile.family
        })
        familiesLoaded.value = true
    }

    // Очистка данных (опционально)
    function clearStore() {
        families.value = {}
        profiles.value = {}
        members.value = {}
        familiesLoaded.value = false
    }

    // Получить членов семьи по ID (удобный геттер)
    function getFamilyMembers(familyId: string): FamilyMember[] {
        return members.value[familyId] || []
    }

    // Получить семью по ID (удобный геттер)
    function getFamily(familyId: string): Family | undefined {
        return families.value[familyId]
    }

    return {
        // Реактивные данные
        families,
        profiles,
        familiesLoaded,
        members,
        tasks,

        // Методы
        loadMembers,
        loadFamilies,
        loadTasks,
        clearStore,
        getFamilyMembers,
        getFamily
    }
})

export default useFamilyStore