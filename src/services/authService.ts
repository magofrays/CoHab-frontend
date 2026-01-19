import {apiRequest} from "@/services/api.ts";


export const authService = {
    async isAuthenticated(): Promise<Boolean> {
        const response = await apiRequest("auth/isAuthenticated", {method: 'POST'});
        return response.ok;
    },

    async checkUser(): Promise<Boolean> {
        const response = await apiRequest("auth/isUser", {method: 'POST'});
        return response.ok;
    },

    logout()  {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
    }
}