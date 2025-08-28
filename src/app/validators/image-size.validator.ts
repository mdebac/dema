import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function ValidateImageSize(sizeLimit: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value?.size > sizeLimit) {
      return { invalidImageSize: true };
    }
    return null;
  }
}
// 1090000  =  1Mb