import {Component, inject} from '@angular/core';
import {ApartmentStore} from "../../services/apartments-store.service";
import {filter} from "rxjs/operators";
import {of} from "rxjs";
import { LetDirective } from '@ngrx/component';
import { MyCvContainerComponent } from './my-cv-container/my-cv-container.component';

@Component({
    selector: 'main-page-my-cv',
    templateUrl: './main-page-my-cv.html',
    styleUrl: './main-page-my-cv.scss',
    imports: [LetDirective, MyCvContainerComponent]
})
export class MainPageMyCv {
  private store = inject(ApartmentStore);
  colors$ = this.store.colors$.pipe(filter((e) => !!e));
  constructor() {
    console.log("MainPageMyCv")
  }
}
