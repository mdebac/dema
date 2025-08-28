import {Component, inject, Input} from '@angular/core';
import {MyCvDatasource} from "./my-cv-datasource";
import {CVStore} from "../../../services/cv-store.service";
import moment from 'moment';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'my-cv-table',
    templateUrl: './my-cv-table.component.html',
    styleUrl: './my-cv-table.component.scss',
    imports: [MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatSortHeader, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatPaginator]
})
export class MyCvTableComponent {
  private readonly store = inject(CVStore);

  @Input() cvCount: number = 0;

  dataSource: MyCvDatasource;
  displayedColumns = ['name', 'email', 'coverLetterText', 'fileName','createdOn'];

  constructor() {
    this.dataSource = new MyCvDatasource(this.store);
  }

  download(id:number, name:string){
    this.store.downloadReportEffect({id,name});
  }

  formatDate(date: Date){
    return moment(date).toISOString().substring(0, 19).replace('T', ' ');
  }

}
//https://stackblitz.com/edit/angular-material-table-accordion-rows?file=src%2Fapp%2Ftable-expandable-rows-example.ts
//https://stackblitz.com/edit/table-like-mat-accordion-htchmtwt?file=app%2Fapp.component.ts,app%2Fapp.component.html
