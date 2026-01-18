import { apiService } from '@/services/api';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = localStorage.getItem('token');
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

  const checkAuth = async(): Promise<boolean> => {
    const response = await apiService.post('auth/isAuthenticated', null);
    if (response.ok) {
      return true; 
    } else {
      return false;
    }
  }

if (to.meta.requiresAuth) {
    if (!token || !(await checkAuth())) {
    localStorage.removeItem('token');
    next('/login');
    return;
    }
    next();
} else if (to.path === '/login' && token && (await checkAuth())) {
    next('/');
} else{
    next();
}
};