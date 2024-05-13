import { AbstractControl } from '@angular/forms';

export function dateValidator(
  control: AbstractControl
): { [key: string]: any } | null {
  if (new Date(control.value) > new Date()) {
    return null;
  }

  return { past: true };
}
