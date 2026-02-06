import {Component, inject} from '@angular/core';
import {ApartmentStore} from "../../services/apartments-store.service";
import {LetDirective} from "@ngrx/component";
import {CustomersTableComponent} from "../tables/customers-table/customers-table.component";
import {ProductTableComponent} from "./product-table/product-table.component";
import {filter} from "rxjs/operators";

@Component({
  selector: 'dashboard-products',
  imports: [
    LetDirective,
    ProductTableComponent
  ],
  templateUrl: './dashboard-products.component.html',
  styleUrl: './dashboard-products.component.scss',
})
export class DashboardProductsComponent {

  private store = inject(ApartmentStore);

  expandedElement$ = this.store.expandedElement$;
  mainId$ = this.store.mainId$.pipe(filter((e) => !!e));
}
