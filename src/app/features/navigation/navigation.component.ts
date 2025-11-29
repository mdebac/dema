import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import {MatCardFooter} from "@angular/material/card";

@Component({
    selector: 'navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    imports: [RouterOutlet],
})
export class NavigationComponent {

  apartmanId:number = 0;

  isHandset$: Observable<boolean> = of(true);
  constructor() {}

//tražilica

}
