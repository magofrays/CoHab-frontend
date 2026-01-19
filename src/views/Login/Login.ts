import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {apiService} from '@/services/api';
import ValidationErrorComponent from "@/error/templates/ValidationErrorComponent.vue";
import {AuthError, ValidationError} from "@/error/types/errors.ts";
import Header from "@/views/header/Header.vue";
import AuthErrorComponent from "@/error/templates/AuthErrorComponent.vue";

export default {
  name: 'LoginView',
  components: {AuthErrorComponent, Header, ValidationErrorComponent, ValidationError: ValidationErrorComponent},
  setup() {
    const router = useRouter();
    const username = ref<string>('');
    const password = ref<string>('');
    const loading = ref<boolean>(false);
    const errorState= ref<{ validationError?: ValidationError | null, authError?: AuthError | null }> ({
      validationError: null,
      authError: null
    });

    const hasErrors = computed(() => {
      let value = errorState.value;
      return value.validationError !== null || value.authError !== null;
    })
    const handleLogin = async (): Promise<void> => {
      loading.value = true;
      try {
        const data = await apiService.post('auth/login', {
          username: username.value,
          password: password.value,
        });
        localStorage.setItem('token', data.body.token);
        localStorage.setItem('tokenExpiresAt', data.body.expiresAt);
        await router.push('/');

      } catch (err: unknown) {
        if (err instanceof ValidationError) {
          errorState.value.validationError = err;
        }
        if(err instanceof AuthError) {
          errorState.value.authError = err;
        }

      } finally {
        loading.value = false;
      }
    };

    return {
      username,
      password,
      errorState,
      loading,
      hasErrors,
      handleLogin,
    };
  },
};