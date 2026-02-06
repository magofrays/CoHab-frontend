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

