import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-errors',
  imports: [CommonModule],
  templateUrl: './validation-errors.html',
  styleUrl: './validation-errors.css',
})
export class ValidationErrors {
  @Input() control: AbstractControl | null = null;
  @Input() label: string = 'Fältet';

  get errors(): string[] {
    if (!this.control || !this.control.errors || !this.control.touched) return [];

    const errors: string[] = [];
    const e = this.control.errors;

    if (e['required']) errors.push(`${this.label} är obligatoriskt`);
    if (e['email']) errors.push(`${this.label} måste vara en giltig e-postadress`);
    if (e['minlength'])
      errors.push(`${this.label} måste vara minst ${e['minlength'].requiredLength} tecken`);
    if (e['maxlength'])
      errors.push(`${this.label} får vara max ${e['maxlength'].requiredLength} tecken`);
    if (e['min']) errors.push(`${this.label} måste vara minst ${e['min'].min}`);
    if (e['pattern']) errors.push(`${this.label} har ett ogiltigt format`);
    if (e['postalCode']) errors.push(`${this.label} måste vara ett giltigt postnummer (5 siffror)`);
    if (e['numeric']) errors.push(`${this.label} får endast innehålla siffror`);

    return errors;
  }
}
