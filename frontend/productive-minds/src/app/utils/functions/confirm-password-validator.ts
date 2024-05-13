import { AbstractControl } from '@angular/forms';

export function passwordsValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  if (control.get('original')?.value === control.get('confirm')?.value) {
    return null;
  }
  return { mismatch: true };
}
