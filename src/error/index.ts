import { ref } from "vue";
import {ValidationError} from "@/error/types/errors.ts";

class ErrorService {
    private oldValidationErrors: ValidationError[] = [];
    private currentValidationErrors: ValidationError[] = [];

    addValidationError(error: ValidationError) {
        this.currentValidationErrors.push(error);
        console.error("Ошибка валидации: ", error);
    }

    getOldValidationErrors(): ValidationError[] {
        return this.oldValidationErrors;
    }

    getCurrentValidationErrors(): ValidationError[] {
        this.currentValidationErrors.forEach((error: ValidationError) => {this.oldValidationErrors.push(error);})
        let temp: ValidationError[] = this.currentValidationErrors;
        this.currentValidationErrors = [];
        return temp;
    }

}

export const errorService = new ErrorService();