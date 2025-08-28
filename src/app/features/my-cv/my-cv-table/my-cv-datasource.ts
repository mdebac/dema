import { Observable} from "rxjs";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {CvData} from "../../../domain/cv-data";
import {CVStore} from "../../../services/cv-store.service";

export class MyCvDatasource extends DataSource<CvData> {

  constructor(private store: CVStore) {
    super();
    this.store.loadCVEffect(this.store.cvCriteria$);
  }

  connect(collectionViewer: CollectionViewer): Observable<CvData[]> {
    return this.store.cvList$;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }

}
