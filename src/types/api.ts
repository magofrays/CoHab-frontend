import type {ProblemDetail} from "@/error/types/errors.ts";

export interface ErrorParse {
  fieldErrors?: ProblemDetail[];
  type?: string;
  title?: string;
  status: number;
  detail?: string;
  instance?: string;
  // Дополнительные поля, которые могут быть в вашем Spring приложении
  timestamp?: string;
  message?: string;
  path?: string;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  expiresAt: string;
}

export interface ApiError {
  message: string;
  status: number;
  problem?: ErrorParse;
}

// Family and Member DTOs
export interface PersonalInfoDto {
  firstname?: string;
  lastname?: string;
  birthDate?: string;
}

export interface AccessDto {
  id?: string;
  name?: string;
  // Добавьте другие поля AccessDto если необходимо
}

export interface ReadFamilyDto {
  id: string;
  familyName: string;
  createdBy: string;
}

export interface ReadMemberDto {
  id: string;
  username: string;
  personalInfoDto?: PersonalInfoDto;
  familyDtos?: ReadFamilyDto[];
  accesses?: AccessDto[];
}

export interface CreateFamilyDto {
  familyName: string;
}