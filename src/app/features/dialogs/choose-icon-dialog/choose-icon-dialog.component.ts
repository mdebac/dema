import {Component, inject} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {MatButton} from '@angular/material/button';
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'choose-icon-dialog',
  imports: [
    MatButton,
    MatIcon,
    MatCard,
    MatCardContent
  ],
  templateUrl: './choose-icon-dialog.component.html',
  styleUrl: './choose-icon-dialog.component.scss'
})
export class ChooseIconDialogComponent {
  dialogRef = inject(MatDialogRef<ChooseIconDialogComponent>)

  toChoose: string[]= ['close','favorite', 'add'];

  selectIcon(icon:string){
    this.dialogRef.close(icon);
  }

}
