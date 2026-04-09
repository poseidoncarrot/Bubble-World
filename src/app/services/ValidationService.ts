import { VALIDATION_LIMITS } from '../constants/theme';
import { ValidationError, UniverseFormData, PageFormData, SubsectionFormData } from '../types/enhanced';
import { ErrorService } from './ErrorService';

export class ValidationService {
  static validateUniverseName(name: string): ValidationError | null {
    if (!name || name.trim().length === 0) {
      return ErrorService.createValidationError('name', name, 'Universe name is required');
    }
    
    if (name.length > VALIDATION_LIMITS.universeName) {
      return ErrorService.createValidationError(
        'name', 
        name, 
        `Universe name must be ${VALIDATION_LIMITS.universeName} characters or less`
      );
    }
    
    if (name.trim().length !== name.length) {
      return ErrorService.createValidationError(
        'name', 
        name, 
        'Universe name cannot start or end with whitespace'
      );
    }
    
    return null;
  }

  static validateUniverseDescription(description: string): ValidationError | null {
    if (description.length > VALIDATION_LIMITS.universeDescription) {
      return ErrorService.createValidationError(
        'description', 
        description, 
        `Description must be ${VALIDATION_LIMITS.universeDescription} characters or less`
      );
    }
    
    return null;
  }

  static validateUniverse(data: UniverseFormData): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const nameError = this.validateUniverseName(data.name);
    if (nameError) errors.push(nameError);
    
    const descriptionError = this.validateUniverseDescription(data.description);
    if (descriptionError) errors.push(descriptionError);
    
    return errors;
  }

  static validatePageTitle(title: string): ValidationError | null {
    if (!title || title.trim().length === 0) {
      return ErrorService.createValidationError('title', title, 'Page title is required');
    }
    
    if (title.length > VALIDATION_LIMITS.pageTitle) {
      return ErrorService.createValidationError(
        'title', 
        title, 
        `Page title must be ${VALIDATION_LIMITS.pageTitle} characters or less`
      );
    }
    
    return null;
  }

  static validatePageDescription(description: string): ValidationError | null {
    if (description.length > VALIDATION_LIMITS.pageDescription) {
      return ErrorService.createValidationError(
        'description', 
        description, 
        `Page description must be ${VALIDATION_LIMITS.pageDescription} characters or less`
      );
    }
    
    return null;
  }

  static validatePage(data: PageFormData): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const titleError = this.validatePageTitle(data.title);
    if (titleError) errors.push(titleError);
    
    const descriptionError = this.validatePageDescription(data.description);
    if (descriptionError) errors.push(descriptionError);
    
    return errors;
  }

  static validateSubsectionTitle(title: string): ValidationError | null {
    if (!title || title.trim().length === 0) {
      return ErrorService.createValidationError('title', title, 'Subsection title is required');
    }
    
    if (title.length > VALIDATION_LIMITS.pageTitle) {
      return ErrorService.createValidationError(
        'title', 
        title, 
        `Subsection title must be ${VALIDATION_LIMITS.pageTitle} characters or less`
      );
    }
    
    return null;
  }

  static validateSubsection(data: SubsectionFormData): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const titleError = this.validateSubsectionTitle(data.title);
    if (titleError) errors.push(titleError);
    
    return errors;
  }

  static validateEmail(email: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || email.trim().length === 0) {
      return ErrorService.createValidationError('email', email, 'Email is required');
    }
    
    if (!emailRegex.test(email)) {
      return ErrorService.createValidationError('email', email, 'Please enter a valid email address');
    }
    
    return null;
  }

  static validatePassword(password: string): ValidationError | null {
    if (!password || password.length === 0) {
      return ErrorService.createValidationError('password', password, 'Password is required');
    }
    
    if (password.length < 8) {
      return ErrorService.createValidationError('password', password, 'Password must be at least 8 characters long');
    }
    
    // Check for at least one uppercase, one lowercase, and one number
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumber) {
      return ErrorService.createValidationError(
        'password', 
        password, 
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
    }
    
    return null;
  }

  static validateRequired(value: any, fieldName: string): ValidationError | null {
    if (value === null || value === undefined || value === '') {
      return ErrorService.createValidationError(fieldName, value, `${fieldName} is required`);
    }
    
    return null;
  }

  static validateMaxLength(value: string, fieldName: string, maxLength: number): ValidationError | null {
    if (value && value.length > maxLength) {
      return ErrorService.createValidationError(
        fieldName, 
        value, 
        `${fieldName} must be ${maxLength} characters or less`
      );
    }
    
    return null;
  }

  static validateMinLength(value: string, fieldName: string, minLength: number): ValidationError | null {
    if (value && value.length < minLength) {
      return ErrorService.createValidationError(
        fieldName, 
        value, 
        `${fieldName} must be at least ${minLength} characters long`
      );
    }
    
    return null;
  }

  static getFirstError(errors: ValidationError[]): ValidationError | null {
    return errors.length > 0 ? errors[0] : null;
  }

  static hasErrors(errors: ValidationError[]): boolean {
    return errors.length > 0;
  }
}
