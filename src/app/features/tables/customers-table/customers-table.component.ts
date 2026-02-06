import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnDestroy,
    OnInit, QueryList,
    ViewChild, ViewChildren
} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
} from '@angular/material/table';
import {MainTableDatasource} from "../main-table-datasource";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {filter, takeUntil} from "rxjs/operators";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {Router, RouterLinkActive} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {ApartmentStore} from "../../../services/apartments-store.service";
import {Chip} from "../../../domain/chip.enum";
import {Apartment} from "../../../domain/apartment";
import {ConformationDialogComponent} from "../../dialogs/conformation-dialog/conformation-dialog.component";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Customer} from "../../../domain/customer";
import {animate, state, style, transition, trigger} from "@angular/animations";

import {MatOption, MatSelect} from "@angular/material/select";
import {Roles} from "../../../domain/roles";
import {AuthStore} from "../../../services/authentication/auth-store";
import {ApartmentDialogComponent} from "../../dialogs/apartment-dialog/apartment-dialog.component";

@Component({
    selector: 'customers-table',
    templateUrl: './customers-table.component.html',
    styleUrls: ['./customers-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [MainTableDatasource],
    imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatIcon,
    MatSortHeader,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatSelect,
    MatOption,
    TranslatePipe,
    RouterLinkActive,
    MatFabButton
],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class CustomersTableComponent implements AfterViewInit, OnInit, OnDestroy {
    store = inject(ApartmentStore);
    dialog = inject(MatDialog);
    router = inject(Router);
    authStore = inject(AuthStore);
    translateService = inject(TranslateService);

    @Input() chip: Chip | null = null;
    @Input() title: string | null = null;
    @Input() apartmentsCount: number = 0;

    @ViewChild(MatButton) button: MatButton | undefined;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<Apartment>;
    @ViewChildren('innerTables') innerTables: QueryList<MatTable<Customer>> | undefined;
    @ViewChildren('innerSort') innerSort: QueryList<MatSort> | undefined;

    dataSource: MainTableDatasource;
    unsubscribe$ = new Subject<void>();
    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['customers','actions', 'domain'];
    innerDisplayedColumns = ['name', 'email', 'role'];
    isAdmin: boolean = false;
    expandedElement: Apartment | null = null;
    rolesToChoose: string[] =  ["MANAGER", "USER"];

    constructor() {
        this.isAdmin = this.authStore.authorize(Roles.ADMIN);
        this.dataSource = new MainTableDatasource(this.store);
        this.dataSource.loadDomains();
    }

    changeRole(userId: number, role:string){
       this.store.updateUserRoleEffect({userId: userId, role: role});
    }

    ngAfterViewInit(): void {
        // this.dataSource.sort = this.sort;
        //this.dataSource.paginator = this.paginator;
        // this.table.dataSource = this.dataSource;

        // reset the paginator after sorting
     /*   this.sort.sortChange.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadApartmentsPage()),
                takeUntil(this.unsubscribe$)
            )
            .subscribe();
*/
    }

    // loadApartmentsPage() {
    //
    //     this.dataSource.loadApartments(
    //         this.chip,
    //         this.title,
    //         this.sort.direction,
    //         this.paginator.pageIndex,
    //         this.paginator.pageSize,
    //     );
    // }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    conformationDialog() {
        const dialogRef = this.dialog.open(ConformationDialogComponent, {
            width: '20rem',
            data: this.translateService.instant('delete.page')
        });
        return dialogRef.afterClosed();
    }

    deleteApartment(id: number) {
        this.conformationDialog().pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(confirm => {
                if (confirm) {
                    this.store.deleteApartmentByIdEffect(id)
                }
            }
        );
    }


    updateApartment(apartment: Apartment) {
      //  console.log("updateApartment dialog enter", apartment);
        this.openApartmentDialog(apartment).pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(detailProps => {
           //     console.log("updateApartment dialog finish", detailProps);
                this.store.createMainEffect(detailProps);
                window.location.reload();
            }
        );
    }

    openApartmentDialog(apartment?: Partial<Apartment>) {
        const dialogRef = this.dialog.open(ApartmentDialogComponent, {
            width: '800px',
            data: {
                ...apartment
            },
        });
        return dialogRef.afterClosed();
    }

    onToggleCustomers(element: Apartment){
        if(element == this.expandedElement){
            this.expandedElement = null;
        }else{
            this.expandedElement = element;
        }
    }

    protected readonly Roles = Roles;
}


