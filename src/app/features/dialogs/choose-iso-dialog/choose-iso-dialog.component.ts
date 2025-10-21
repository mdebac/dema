import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CountryIso, getValueByKeyForStringEnum} from "../../../domain/countries-iso";
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag } from "@angular/cdk/drag-drop";
import {MatFabButton} from '@angular/material/button';
import {NgClass} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLinkActive} from "@angular/router";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
    selector: 'choose-iso-dialog',
    templateUrl: './choose-iso-dialog.component.html',
    styleUrl: './choose-iso-dialog.component.scss',
    imports: [CdkDropList, CdkDrag, NgClass, TranslatePipe, MatFabButton, RouterLinkActive, MatCard, MatCardContent]
})
export class ChooseIsoDialogComponent{

  dialogRef = inject(MatDialogRef<ChooseIsoDialogComponent>)

  chosen:string[];
  toChoose: string[];

  constructor(@Inject(MAT_DIALOG_DATA) private chosenLanguages: string[]) {
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

    flag(country:string){
        return "fi fi-"+country.toLowerCase();
    }

    protected readonly getValueByKeyForStringEnum = getValueByKeyForStringEnum;
}
