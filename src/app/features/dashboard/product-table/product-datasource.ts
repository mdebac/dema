import {Observable} from "rxjs";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Injectable} from "@angular/core";
import {ProductType} from "../../../domain/product-type";
import {ApartmentStore} from "../../../services/apartments-store.service";


@Injectable()
export class ProductDatasource extends DataSource<Partial<ProductType>> {

  constructor(private apartmentStore: ApartmentStore) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Partial<ProductType>[]> {
    return this.apartmentStore.products$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  loadProducts(
    title:string | null = null,
    sortDirection:string = 'asc',
    pageIndex:number = 0,
    pageSize:number = 20)  {
    this.apartmentStore.fetchProductsEffect();
  }

}
