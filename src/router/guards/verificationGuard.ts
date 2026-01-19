import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import {authService} from "@/services/authService.ts";

export const verificationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {


  const checkUser = async(): Promise<Boolean> => {
      return authService.checkUser();
  }
  
  if(to.meta.requiresVerification){
    
    if(!(await checkUser())){
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