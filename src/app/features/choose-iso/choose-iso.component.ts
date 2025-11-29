import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CountryIso, getIsoByKey} from "../../domain/countries-iso";
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDropList, CdkDrag } from "@angular/cdk/drag-drop";
import {MatFabButton} from '@angular/material/button';
import {NgClass} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLinkActive} from "@angular/router";
import {MatCard, MatCardContent} from "@angular/material/card";
import {Language} from "../../domain/language";

@Component({
    selector: 'choose-iso',
    templateUrl: './choose-iso.component.html',
    styleUrl: './choose-iso.component.scss',
    imports: [CdkDropList, CdkDrag, NgClass, TranslatePipe, MatFabButton, RouterLinkActive, MatCard, MatCardContent]
})
export class ChooseIsoComponent {

    toChoose: string[] = [];
    chosen: string[] = [];

    @Input() set chosenLanguages (chosenLanguages:Language[] | undefined){
        if(chosenLanguages){
            this.chosen = chosenLanguages?.map(l => l.iso);
            const isoList:string[] = Object.keys(CountryIso);
            this.toChoose = isoList.filter(item => !this.chosen.includes(item))
        }
    }

  @Output() selectedIso : EventEmitter<string[]> = new EventEmitter();

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
      if(this.chosen.includes("GB-eng")){
          this.selectedIso.emit(this.chosen);
      }
  }

    flag(country:string){
        return "fi fi-"+country.toLowerCase() + " fa-xl";
    }

}
