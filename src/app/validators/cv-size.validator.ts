import { AbstractControl } from '@angular/forms';

export function ValidateCVSize(control: AbstractControl) {

  console.log("ValidateCVSize", control.value?.size)

  if (control.value?.size > 1090000) {
    return { invalidCvSize: true };
  }
  return null;
}
