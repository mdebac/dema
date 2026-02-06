import {Component, inject, OnInit} from '@angular/core';
import {ApartmentStore} from "../../../../services/apartments-store.service";
import {RouterLink} from "@angular/router";
import {LetDirective} from "@ngrx/component";

@Component({
  selector: 'hotel-search',
  imports: [
    RouterLink,
    LetDirective
  ],
  templateUrl: './hotel-search.component.html',
  styleUrl: './hotel-search.component.scss',
})
export class HotelSearchComponent implements OnInit{
  store = inject(ApartmentStore);
 // pageCount$ = this.store.pageCount$;

  hotels$= this.store.hotels$;

  ngOnInit() {
    //this.store.loadMyHotelsEffect();
  }

}
