import {Component, inject, OnInit} from '@angular/core';
import {DomainsTableComponent} from "../../../tables/domains-table/domains-table.component";
import {LetDirective} from "@ngrx/component";
import {ApartmentStore} from "../../../../services/apartments-store.service";

@Component({
  selector: 'domains',
  imports: [
    DomainsTableComponent,
    LetDirective
  ],
  templateUrl: './domains.component.html',
  styleUrl: './domains.component.scss'
})
export class DomainsComponent implements OnInit{
  store = inject(ApartmentStore);
  pageCount$ = this.store.pageCount$;

  ngOnInit() {
    console.log("Domains table load");
    this.store.loadMyDomainsEffect();
  }
}
