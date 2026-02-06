import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell, MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow, MatRowDef, MatTable
} from "@angular/material/table";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {Router} from '@angular/router';
import {ApartmentStore} from "../../../services/apartments-store.service";
import {Chip} from "../../../domain/chip.enum";
import {Apartment} from "../../../domain/apartment";
import {ConformationDialogComponent} from "../../dialogs/conformation-dialog/conformation-dialog.component";
import {TranslateService} from "@ngx-translate/core";
import {Roles} from "../../../domain/roles";
import {
    AfterViewInit,
    ChangeDetectionStrategy, Component,
    inject,
    Input,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren
} from "@angular/core";
import {MatPaginator} from "@angular/material/paginator";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {ProductDatasource} from "./product-datasource";
import {ProductProperty} from "../../../domain/product-property";
import {ProductType} from "../../../domain/product-type";
import {AuthStore} from "../../../services/authentication/auth-store";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {filter, takeUntil} from "rxjs/operators";
import {SafeHtmlPipe} from "../../../pipes/safe-html-pipe";

@Component({
    selector: 'product-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ProductDatasource],
    templateUrl: './product-table.component.html',
    styleUrl: './product-table.component.scss',
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
        MatFabButton,
        MatOption,
        MatSelect,
        FormsModule,
        MatInput,
        SafeHtmlPipe,
    ],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class ProductTableComponent implements AfterViewInit, OnInit, OnDestroy {
    store = inject(ApartmentStore);
    dialog = inject(MatDialog);
    router = inject(Router);
    translateService = inject(TranslateService);
    authStore = inject(AuthStore);

    @Input() chip: Chip | null = null;
    @Input() title: string | null = null;
    @Input() apartmentsCount: number = 0;
    @Input() mainId: number | undefined;
    @Input() expandedElement: Partial<ProductType> | null = null;

    @ViewChild(MatButton) button: MatButton | undefined;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<Apartment>;
    @ViewChildren('innerTables') innerTables: QueryList<MatTable<ProductProperty>> | undefined;
    @ViewChildren('innerSort') innerSort: QueryList<MatSort> | undefined;

    dataSource: ProductDatasource;
    unsubscribe$ = new Subject<void>();

    displayedColumns = ['properties', 'actions', 'name', 'new_product'];
    innerDisplayedColumns = ['property_space', 'property_actions', 'property_name', 'property_type', 'property_unit','new_property'];

    isAdmin: boolean = false;
    canEdit: boolean = false;

    typeToChoose: string[] = ["INTEGER", "STRING", "BOOLEAN", "DATE"];

    constructor() {
        this.dataSource = new ProductDatasource(this.store);
        this.isAdmin = this.authStore.authorize(Roles.ADMIN);
        this.canEdit = this.authStore.authorize(Roles.ADMIN) || this.authStore.authorize(Roles.MANAGER);
        this.dataSource.loadProducts();
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

    onEdit(subject: any) {
        subject.isEdit = true;
    }

    cancelEdit(subject: any) {
        subject.isEdit = false;
    }

    saveProperty(subject: any) {
        if(subject.name.length > 0){
            console.log("save property", subject);
           this.store.saveProductPropertyEffect(subject);
            subject.isEdit = false;
        }
    }

    saveProduct(subject: any) {
        if(subject.name.length > 0){
            console.log("save product");
            this.store.saveProductEffect(subject);
            subject.isEdit = false;
        }
    }

    createNewProduct() {
        const newProduct: Partial<ProductType> = {
            name: "",
            mainId: this.mainId,
            properties: []
        }//
        console.log("add product");
        this.store.addProduct(newProduct);
    }

    createNewProperty(product: ProductType) {
        const newProductProperty: Partial<ProductProperty> = {
            name: "",
            type: "STRING",
            productId: product.id,
            unit: ""
        }//
        console.log("add product property");
        this.store.addProductProperty(newProductProperty);
    }

    deleteProperty(id: number) {
        console.log("delete property id", id);
        this.conformationDialogProperty().pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(confirm => {
              if (confirm) {
                this.store.deleteProductPropertyEffect(id);
              }
            }
        );
    }

    deleteProduct(id:number){
        this.conformationDialogProduct().pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(confirm => {
              if (confirm) {
                this.store.deleteProductEffect(id);
              }
            }
        );
    }

    conformationDialogProduct() {
        const dialogRef = this.dialog.open(ConformationDialogComponent, {
            width: '20rem',
            data: this.translateService.instant('delete.product')
        });
        return dialogRef.afterClosed();
    }

    conformationDialogProperty() {
        const dialogRef = this.dialog.open(ConformationDialogComponent, {
            width: '20rem',
            data: this.translateService.instant('delete.property')
        });
        return dialogRef.afterClosed();
    }
    // updateProductDialog(product: ProductType) {
    //   //  console.log("updateApartment dialog enter", apartment);
    //   this.openProductDialog(product).pipe(
    //       filter(val => !!val),
    //       takeUntil(this.unsubscribe$)
    //   ).subscribe(detailProps => {
    //             console.log("updateApartment dialog finish", detailProps);
    //      //   this.store.createMainEffect(detailProps);
    //      //   window.location.reload();
    //       }
    //   );
    // }
    //
    // openProductDialog(product?: Partial<ProductType>) {
    //   const dialogRef = this.dialog.open(ProductDialogComponent, {
    //     maxWidth: '29rem',
    //     data: {
    //       ...product
    //     },
    //   });
    //    return dialogRef.afterClosed();
    // }

    onToggleCustomers(element: ProductType) {
        if (element == this.expandedElement) {
            this.store.setExpandedElement(null);
        } else {
            this.store.setExpandedElement(element);
        }
    }


}


