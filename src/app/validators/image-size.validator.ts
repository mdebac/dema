import { AbstractControl } from '@angular/forms';

export function ValidateImageSize(control: AbstractControl) {

  console.log("ValidateImageSize", control.value?.size)

  if (control.value?.size > 1090000) {
    return { invalidImageSize: true };
  }
  return null;
}
