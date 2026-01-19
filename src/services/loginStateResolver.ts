import {useRoute} from 'vue-router'
import {computed} from "vue";



const routesDict = {
    '/login': {
        path: '/login',
        requiresAuth: false,
        requiresVerification: false
    },
    '/registration': {
        path: '/registration',
        requiresAuth: false,
        requiresVerification: false
    },
    '/': {
        path: '/',
        requiresAuth: true,
        requiresVerification: true
    },
    '/verification': {
        path: '/verification',
        requiresAuth: true,
        requiresVerification: false
    }
}


export function getLoginState() {
    const route = useRoute();
    const loginState = computed(() => {
        const path = route.path
        return routesDict[path as keyof typeof routesDict] || null
    })
    return {loginState}
}