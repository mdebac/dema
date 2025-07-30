import {Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'conformation-dialog',
    templateUrl: './conformation-dialog.component.html',
    styleUrl: './conformation-dialog.component.scss',
    imports: [MatCard, MatCardContent, MatLabel, MatButton, TranslatePipe]
})
export class ConformationDialogComponent {

  dialogRef = inject(MatDialogRef<ConformationDialogComponent>)

  label: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: string) {
    this.label = data;
  }

  onYes() {
    this.dialogRef.close(true);
  }

  onNo() {
    this.dialogRef.close(false);
  }

}
//https://stackoverflow.com/questions/58238935/set-a-value-of-file-input-in-angular-8-when-editing-an-item

