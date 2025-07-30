import {Component, inject} from '@angular/core';
import {filter, takeUntil} from "rxjs/operators";
import {ApartmentStore} from "../../services/apartments-store.service";

import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'reklame',
    templateUrl: './reklame.component.html',
    styleUrl: './reklame.component.scss'
})
export class ReklameComponent {

  store = inject(ApartmentStore);
  unsubscribe$ = new Subject<void>();
  error$ = this.store.error$.pipe(filter((e) => !!e));
  dialog = inject(MatDialog);

}
