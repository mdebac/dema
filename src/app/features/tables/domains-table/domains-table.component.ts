import {
  Component,
  inject,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ApartmentStore} from "../../../services/apartments-store.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {AuthStore} from "../../../services/authentication/auth-store";
import {TranslateService} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {
  MatCell,
  MatCellDef,
  MatColumnDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {Apartment} from "../../../domain/apartment";
import {MainTableDatasource} from "../main-table-datasource";
import {Subject} from "rxjs";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'domains-table',
  imports: [
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatTable,
    NgStyle,
  ],
  templateUrl: './domains-table.component.html',
  styleUrl: './domains-table.component.scss'
})
export class DomainsTableComponent implements OnDestroy {

  store = inject(ApartmentStore);
  dialog = inject(MatDialog);
  router = inject(Router);
  authStore = inject(AuthStore);
  translateService = inject(TranslateService);

  @Input() pageCount: number = 0;

  @ViewChild(MatButton) button: MatButton | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Apartment>;
  @ViewChildren('innerSort') innerSort: QueryList<MatSort> | undefined;

  dataSource: MainTableDatasource;
  unsubscribe$ = new Subject<void>();
  displayedColumns = ['domain'];

  constructor() {
    this.dataSource = new MainTableDatasource(this.store);
    this.dataSource.loadDomains();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  resolveHeader(colName: string){
    return this.translateService.instant(colName + '.domains.table')
  }

  goTo(url:string){
    window.open('https://' + url, '_blank');
  }
}


