import {Component, inject, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {CvData} from "../../../domain/cv-data";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ValidateCVSize} from "../../../validators/cv-size.validator";
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha-2';
import { TranslatePipe } from '@ngx-translate/core';
import {environment} from "../../../../environments/environment";
import {CVStore} from "../../../services/cv-store.service";

@Component({
    selector: 'cv-data-dialog',
    templateUrl: './cv-data-dialog.component.html',
    styleUrl: './cv-data-dialog.component.scss',
    imports: [MatCard, MatCardHeader, MatCardContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatIcon, MatSuffix, MatError, MatButton, NgIf, RecaptchaModule, TranslatePipe]
})
export class CvDataDialogComponent {
  store = inject(CVStore);
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);

  form:FormGroup;
  captchaKey:string = environment.recaptcha.siteKey;
  captchaResolved : boolean = false;
  captchaResponse:string = "";

  constructor(@Inject(MAT_DIALOG_DATA) private data: number) {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      coverLetterText: ["", [Validators.required, Validators.minLength(20)]],
      name: ["", [Validators.required, Validators.minLength(4)]],
      content: [null, [Validators.required, ValidateCVSize]],
      itemId: [data, [Validators.required]]
    });
  }

  checkCaptcha(captchaResponse : string | null) {
    this.captchaResolved = !!(captchaResponse && captchaResponse.length > 0)
    if(captchaResponse && this.captchaResolved){
      this.captchaResponse = captchaResponse;
    }
  }

  createCvData() {
    if (this.form.valid) {
     let cvDataProps = this.form.getRawValue() as CvData;

     if(this.captchaResponse){
       cvDataProps = {...cvDataProps, captchaResponse:this.captchaResponse}
       this.store.createCvDataEffect(cvDataProps);
     }

     this.dialog.closeAll();
    }
  }

  selectFile(event: any){
    this.form.patchValue({content:event.target.files[0]})
  }

}
///https://stackblitz.com/edit/angular-ckvs4z?file=src%2Fapp%2Fform-field-appearance-example.html
