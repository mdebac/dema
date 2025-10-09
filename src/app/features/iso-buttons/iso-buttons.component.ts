import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CountryIso, getValueByKeyForStringEnum} from "../../domain/countries-iso";
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatMenuTrigger, MatMenu } from '@angular/material/menu';
import { NgClass } from '@angular/common';

@Component({
    selector: 'iso-buttons',
    templateUrl: './iso-buttons.component.html',
    styleUrl: './iso-buttons.component.scss',
    imports: [MatButton, MatMenuTrigger, NgClass, MatMenu]
})
export class IsoButtonsComponent {

  countriesIso: string[] | undefined | null;
  selectedIso : string = '';

  @Input() set selectedIn(country: string | null) {
    if(country){

        console.log("IsoButtonsComponent", country);
      this.selectedIso = country;
    }
  }

  @Input() set countries(countries: string[] | undefined | null) {
    this.countriesIso = countries;
  }

  @Output() selectedOut : EventEmitter<string> = new EventEmitter();

   flag(country:string){
     return "fi fi-"+country.toLowerCase();
   }

  selectIso(country:string){
    this.selectedOut.emit(country);
    this.selectedIso = country;
   }

  protected readonly CountryIso = CountryIso;
  protected readonly getValueByKeyForStringEnum = getValueByKeyForStringEnum;
}
