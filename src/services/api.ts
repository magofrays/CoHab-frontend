import type { ErrorParse, ApiError, ReadMemberDto, ReadFamilyDto, CreateFamilyDto } from '@/types/api';
import {AuthError, ValidationError} from "@/error/types/errors.ts";

const API_BASE_URL = import.meta.env.VITE_API_URL;
async function parseProblemDetail(response: Response): Promise<void> {

    const problem: ErrorParse = response as ErrorParse;
    switch (problem.status) {
      case 400:
        throw new ValidationError("Ошибка валидации!", problem.fieldErrors);
      case 401:
        throw new AuthError(problem.detail, problem.title);
    }
}


export async function handleApiError(response: Response): Promise<void> {
  await parseProblemDetail(response);
}

export async function apiRequest(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  } as HeadersInit;

  if (token && token !== "undefined") {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  let body: any = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return {
    body,
    ok: response.ok,
    status: response.status
  };
}

export const apiService = {
  async get(url: string) {
    const result = await apiRequest(url);
    if (!result.ok) {
      await handleApiError(result.body);
    }
    return result.body;
  },

  async post(url: string, data: any) {
    console.log('Запрос на: ' + url);
    const result = await apiRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!result.ok) {
      await handleApiError(result.body);
    }
    console.log('Запрос прошел без ошибок.')
    return result;
  },

  async put(url: string, data: any) {
    const result = await apiRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!result.ok) {
      await handleApiError(result.body);
    }
    return result;
  },

  async delete(url: string) {
    const result = await apiRequest(url, { method: 'DELETE' });
    if (!result.ok) {
      await handleApiError(result.body);
    }
    return result;
  },

};

export async function hasFamily(): Promise<boolean> {
  const response = await apiService.post('member/hasFamily', null);
  return response.ok;
}

export async function getFamilyMembers(): Promise<ReadMemberDto[]> {
  const response = await apiService.get('family/members');
  return await response;
}

export async function createFamily(familyName: string): Promise<ReadFamilyDto> {
  if (!familyName || !familyName.trim()) {
    throw new Error('Family name is required');
  }
  const data: CreateFamilyDto = { familyName: familyName.trim() };
  const response = await apiService.post('family/create', data);
  return await response.body;
}