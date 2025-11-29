import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CountryIso, getIsoByKey} from "../../domain/countries-iso";
import {MatButton} from '@angular/material/button';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { NgClass } from '@angular/common';
import {Language} from "../../domain/language";

@Component({
    selector: 'iso-buttons',
    templateUrl: './iso-buttons.component.html',
    styleUrl: './iso-buttons.component.scss',
    imports: [MatButton, MatMenuTrigger, NgClass, MatMenu]
})
export class IsoButtonsComponent {

  countriesIso: Language[] | undefined | null;
  selectedIso : string = '';

  @Input() isMobile: boolean = false;

  @Input() set selectedIn(country: string | null) {
    if(country){
      this.selectedIso = country;
    }
  }

  @Input() set countries(countries: Language[] | undefined | null) {
    this.countriesIso = countries;
  }

  @Output() selectedOut : EventEmitter<string> = new EventEmitter();

   flag(country:string | undefined){
       if(country){
           return "fi fi-"+country.toLowerCase();
       }else{
           return "";
       }

   }

  selectIso(country:string | undefined){
      if(country){
          this.selectedOut.emit(country);
          this.selectedIso = country;
      }
   }

  protected readonly getIsoByKey = getIsoByKey;
}
