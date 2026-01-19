import {authService} from '@/services/authService';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const token = localStorage.getItem('token');
  const tokenExpiresAt = localStorage.getItem('tokenExpiresAt');

  const checkAuth = async(): Promise<boolean> => {
    const response = await authService.isAuthenticated();
    return !!response;
  }

if (to.meta.requiresAuth) {
    if (!token || !(await checkAuth())) {
    localStorage.removeItem('token');
    next('/login');
    return;
    }
    next();
} else if ((to.path === '/login' || to.path === '/registration') && token && (await checkAuth())) {
    next('/');
} else{
    next();
}
};