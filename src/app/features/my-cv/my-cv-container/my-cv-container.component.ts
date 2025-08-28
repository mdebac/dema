import {Component, inject, Input} from '@angular/core';
import {CVStore} from "../../../services/cv-store.service";
import {filter} from "rxjs/operators";
import {ApartmentStore} from "../../../services/apartments-store.service";
import {Colors} from "../../../domain/colors";
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { LetDirective } from '@ngrx/component';
import { MyCvTableComponent } from '../my-cv-table/my-cv-table.component';

@Component({
    selector: 'my-cv-container',
    templateUrl: './my-cv-container.component.html',
    styleUrl: './my-cv-container.component.scss',
    imports: [MatCard, MatCardHeader, MatCardContent, LetDirective, MyCvTableComponent]
})
export class MyCvContainerComponent {
  private readonly cvStore = inject(CVStore);
  cvCount$ = this.cvStore.cvCount$;

  @Input() set colors (colors: Colors){

    console.log("MyCvContainerComponent load colors", colors);
    const variables = [
      '--primary-color: '+ colors.primaryColor +';',
      '--secondary-color: '+ colors.secondaryColor +';',
      '--danger-color: '+ colors.dangerColor +';',
      '--warn-color: '+ colors.warnColor +';',
      '--info-color: '+ colors.infoColor +';',
      '--accept-color: '+ colors.acceptColor +';',
    ];

    const cssVariables = `:root{ ${variables.join('')}}`;
    const blob = new Blob([cssVariables]);
    const url = URL.createObjectURL(blob);
    const cssElement = document.createElement('link');
    cssElement.setAttribute('rel', 'stylesheet');
    cssElement.setAttribute('type', 'text/css');
    cssElement.setAttribute('href', url);
    document.head.appendChild(cssElement);
  }
}
