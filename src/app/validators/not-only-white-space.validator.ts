
import {AbstractControl, ValidationErrors} from '@angular/forms';

export function notOnlyWhitespace(control: AbstractControl) : ValidationErrors | null {

    console.log("notOnlyWhitespace", control.value?.size)
    // check if string only contains whitespace
    if ((control.value != null) && (control.value.trim().length === 0)) {

        // invalid, return error object
        return { 'notOnlyWhitespace': true };
    }
    else {
        // valid, return null
        return null;
    }
}
