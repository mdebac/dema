import {Component, inject, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CountryIso} from "../../../domain/countries-iso";
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag } from "@angular/cdk/drag-drop";
import {ApartmentItem} from "../../../domain/apartment-item";
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'choose-iso-dialog',
    templateUrl: './choose-iso-dialog.component.html',
    styleUrl: './choose-iso-dialog.component.scss',
    imports: [CdkDropList, CdkDrag, MatButton]
})
export class ChooseIsoDialogComponent{

  dialogRef = inject(MatDialogRef<ChooseIsoDialogComponent>)

  chosen:string[];
  toChoose: string[];

  constructor(@Inject(MAT_DIALOG_DATA) private chosenLanguages: string[]) {
    console.log("chosenLanguages", chosenLanguages);
    this.chosen = chosenLanguages.filter(a=> true);
    const isoList:string[] = Object.keys(CountryIso);
    this.toChoose = isoList.filter(item => !this.chosen.includes(item))
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  saveIso(){
       this.dialogRef.close(this.chosen);
  }

}
