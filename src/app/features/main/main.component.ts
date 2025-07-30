import {Component, inject, OnInit} from '@angular/core';
import {ApartmentsHttpService} from "../../services/apartments-http.service";
import {Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {ApartmentStore} from "../../services/apartments-store.service";
import {LetDirective} from "@ngrx/component";
import {SummerComponent} from "./summer.component";

@Component({
  selector: 'dema-main',
  imports: [LetDirective, SummerComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{
  private service = inject(ApartmentsHttpService);
  private store = inject(ApartmentStore);
  columns$ = this.store.columns$.pipe(filter((e) => !!e));
  // primaryColor$ = of("beige")
  // secondaryColor$ = of("#bd0430")
  colors$ = this.store.colors$.pipe(filter((e) => !!e));


  res: string = "";

  ngOnInit() {
    console.log("MainComponent ngOnInit")

  /* this.service.ping().subscribe(
        data => {
          console.log("data",data)
          this.res = data.text;
        }
    );*/

   /*   this.service.ping2().subscribe(
          data => {
              console.log("data",data)
              this.res = data.text;
          }
      );*/

  }

}
