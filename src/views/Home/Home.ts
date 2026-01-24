import {computed, onMounted, ref, watch} from 'vue'
import {apiService} from '@/services/api'
import Header from "@/views/header/Header.vue"
import type {Family, FamilyMember} from "@/types/family.ts"
import getFamilyStore from "@/stores/familyStore.ts"
import type {Task} from "@/types/task.ts";
import TaskComponent from "@/views/Home/templates/TaskComponent.vue";

export default {
  name: 'HomeView',
  components: { Header, TaskComponent },
  setup() {
    const homeLoading = ref(false)
    const familyMembersLoading = ref(false)
    const tasksLoading = ref(false)

    const showCreateFamilyForm = ref(false)
    const showJoinFamilyForm = ref(false)
    const newFamilyName = ref('')
    const joinFamilyCode = ref('')
    const creatingFamily = ref(false)
    const joiningFamily = ref(false)
    const userHasFamily = ref(true)

    const activeFamilyTab = ref<string>()
    const familyMembers = ref<FamilyMember[]>([])
    const currentFamily = ref<Family>()
    const currentTasks = ref<Task[]>([])

    const familyStore = getFamilyStore()

    const families = computed(() => familyStore.families)

    const formatDate = (dateString: string): string => {
      if (!dateString) return 'Не указана'
      const date = new Date(dateString)
      return date.toLocaleDateString('ru-RU')
    }

    const showError = (message: string) => {
      alert(`Ошибка: ${message}`)
    }

    const checkHasFamily = async (): Promise<void> => {
      userHasFamily.value = Object.keys(families.value).length > 0
    }

    const loadFamilies = async (): Promise<void> => {
      homeLoading.value = true
      try {
        if (!familyStore.familiesLoaded) {
          const familiesLoad: FamilyMember[] = (await apiService.get('member/families')).body || []
          familyStore.loadFamilies(familiesLoad)
        }
      } catch (error) {
        console.log(error)
        showError('Ошибка загрузки семей')
      } finally {
        homeLoading.value = false
      }
    }

    const loadTasks = async (familyId: string): Promise<void> => {
      if(!familyId) return
      tasksLoading.value = true
      try {
        if(!familyStore.tasks[familyId]) {
          const tasksLoad: Task[] = (await apiService.get('task/' + familyId)).body || []
          familyStore.loadTasks(tasksLoad, familyId)
        }
        currentTasks.value = familyStore.tasks[familyId] || [];
      } catch (error) {
        console.log(error)
        showError('Ошибка загрузки задач')
      } finally {
        tasksLoading.value = false
      }
    }

    const loadMembers = async (familyId: string): Promise<void> => {
      if (!familyId) return

      familyMembersLoading.value = true
      try {
        if (!familyStore.members[familyId]) {
          const members: FamilyMember[] = (await apiService.get('family/' + familyId + '/members')).body || []
          familyStore.loadMembers(members)
        }
        familyMembers.value = familyStore.members[familyId] || []
      } catch (error) {
        console.log(error)
        showError('Ошибка загрузки членов семьи')
      } finally {
        familyMembersLoading.value = false
      }
    }

    const handleCreateFamily = async (): Promise<void> => {
      creatingFamily.value = true
      try {
        console.log('Creating family:', newFamilyName.value)
        showError('Функция создания семьи пока не реализована')
      } catch (error) {
        console.log(error)
        showError('Ошибка создания семьи')
      } finally {
        creatingFamily.value = false
      }
    }

    const handleJoinFamily = async (): Promise<void> => {
      joiningFamily.value = true
      try {
        // TODO: реализовать присоединение к семье
        console.log('Joining family with code:', joinFamilyCode.value)
        showError('Функция присоединения к семье пока не реализована')
      } catch (error) {
        console.log(error)
        showError('Ошибка присоединения к семье')
      } finally {
        joiningFamily.value = false
      }
    }

    const toggleTask = async (taskId: string): Promise<void> => {
      // TODO
    }

    const deleteTask = async (taskId: string): Promise<void> => {
      // TODO
    }

    const deleteMember = async (memberId: string): Promise<void> => {
      // TODO
    }

    const showAddTaskForm = (): void => {
      alert('Форма добавления задачи - нужно реализовать')
    }

    const showAddMemberForm = (): void => {
      alert('Форма добавления члена семьи - нужно реализовать')
    }

    watch(activeFamilyTab, async (newTab) => {
      if (newTab) {
        await loadMembers(newTab)
        await loadTasks(newTab)
      }
    })

    onMounted(async () => {
      await loadFamilies()
      await checkHasFamily()

      if (userHasFamily.value && Object.keys(families.value).length > 0) {
        activeFamilyTab.value = Object.keys(families.value)[0]
      }
    })

    return {
      homeLoading,
      familyMembersLoading,
      tasksLoading,

      // Form states
      showCreateFamilyForm,
      showJoinFamilyForm,
      newFamilyName,
      joinFamilyCode,
      creatingFamily,
      joiningFamily,
      userHasFamily,

      // Data
      activeFamilyTab,
      familyMembers,
      currentFamily,
      currentTasks,
      families,

      familyStore,

      formatDate,
      showError,
      loadTasks,
      loadMembers,
      handleCreateFamily,
      handleJoinFamily,
      toggleTask,
      deleteTask,
      deleteMember,
      showAddTaskForm,
      showAddMemberForm,
    }
  }
}