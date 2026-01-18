import { apiService } from '@/services/api';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export const verificationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {


  const checkUser = async(): Promise<Boolean> => {
    const response = await apiService.post('auth/isUser', null);
    if(response.ok){
        return true;
    }else{
        return false;
    }
  }
  
  if(to.meta.requiresVerification){
    
    if(!checkUser()){
        next('/verification')
        return;
    }
  }
  else if(to.path === '/verification' && await checkUser()){
    next('/');
    return;
  }
    next();
};