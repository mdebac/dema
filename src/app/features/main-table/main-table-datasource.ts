import {Observable} from "rxjs";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Injectable} from "@angular/core";
import {Apartment} from "../../domain/apartment";
import {ApartmentStore} from "../../services/apartments-store.service";
import {Chip} from "../../domain/chip.enum";


@Injectable()
export class MainTableDatasource extends DataSource<Apartment> {

  constructor(private apartmentStore: ApartmentStore) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<Apartment[]> {
    return this.apartmentStore.apartmentList$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

  loadApartments(
    chip:Chip | null = null,
    title:string | null = null,
    sortDirection:string = 'asc',
    pageIndex:number = 0,
    pageSize:number = 20)  {
    this.apartmentStore.loadApartments(chip,title,sortDirection,pageIndex,pageSize);
  }

}
