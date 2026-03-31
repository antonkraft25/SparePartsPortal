import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AppValidators {
  static postalCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const valid = /^\d{5}$/.test(control.value);
      return valid ? null : { postalCode: true };
    };
  }

  static numeric(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) return null;
      const valid = /^\d+(\.\d+)?$/.test(control.value.toString());
      return valid ? null : { numeric: true };
    };
  }

  static minValue(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value && control.value !== 0) return null;
      const value = parseFloat(control.value);
      return value >= min ? null : { min: { min } };
    };
  }
}
