import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {filter, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {LetDirective} from '@ngrx/component';
import {CustomersTableComponent} from '../tables/customers-table/customers-table.component';
import {ApartmentStore} from "../../services/apartments-store.service";
import {NotificationService} from "../../services/notification.service";
import {Apartment} from "../../domain/apartment";
import {ApartmentDialogComponent} from "../dialogs/apartment-dialog/apartment-dialog.component";
import {TranslatePipe} from "@ngx-translate/core";
import {Roles} from "../../domain/roles";
import {AuthStore} from "../../services/authentication/auth-store";
import {Hosts} from "../../domain/hosts";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        TranslatePipe,
        MatCard,
        MatCardHeader,
        MatIcon,
        MatCardContent,
        LetDirective,
        CustomersTableComponent,
        MatFabButton,
        MatGridList,
        MatGridTile,
    ],
})
export class DashboardComponent implements OnInit, OnDestroy {
    private store = inject(ApartmentStore);
    private notificationService = inject(NotificationService);
    private dialog = inject(MatDialog);
    authStore = inject(AuthStore);

    unsubscribe$ = new Subject<void>();
    error$ = this.store.error$.pipe(filter((e) => !!e));
    chip$ = this.store.filterChip$;
    title$ = this.store.filterTitle$;
    apartmentsCount$ = this.store.pageCount$;
    header$ = this.store.header$;

   // loading$ = this.store.loading$;

    isManager = this.authStore.authorize(Roles.MANAGER);
    isAdmin = this.authStore.authorize(Roles.ADMIN);
    isUser = this.authStore.authorize(Roles.USER);

    ngOnInit() {
        console.log("Dashboard ngOnInit");
        if(this.isAdmin || this.isManager){
            this.store.loadCustomersEffect();
        }
        this.error$.pipe(takeUntil(this.unsubscribe$)).subscribe((error) => {
            this.notificationService.error("error");
            //  this.errorService.constructGrowlFromApiError(error);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
        // this.breadcrumbs.removeItem('apartmants')
    }

    createApartment() {
        this.openDialog(undefined).pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe((detailProps) => {
              this.store.createMainEffect(detailProps);
               window.location.reload();
            }
        );
    }

    openDialog(apartment?: Partial<Apartment>) {
        const dialogRef = this.dialog.open(ApartmentDialogComponent, {
            width: '800px',
            data: {
                ...apartment
            },
        });
        return dialogRef.afterClosed();
    }

    protected readonly Hosts = Hosts;
}


/*
@Component({
    selector: 'calculation-log',
    templateUrl: './calculation-log.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationLogComponent implements OnInit, OnDestroy {
    unsubscribe$ = new Subject<void>();
    page$ = this.store.page$;
    loading$ = this.store.loading$;
    criteria$ = this.store.criteria$;
    error$ = this.store.error$.pipe(filter((e) => !!e));

    constructor(
        private store: CalculationLogStoreService,
        private errorService: ErrorService,
    ) {}

    ngOnInit(): void {
        this.store.getAllCalculationLogsEffect(this.criteria$);
        this.error$.pipe(takeUntil(this.unsubscribe$)).subscribe((error) => {
            this.errorService.constructGrowlFromApiError(error);

        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    updateCriteria(criteria: CalculationLogCriteriaInterface) {
        this.store.patchState({ criteria: criteria });
    }

    refresh() {
        this.store.getAllCalculationLogsEffect(this.criteria$);
    }
}


export class SnackBarOverviewExample {
  constructor(
    public notificationService: NotificationService,
    private _snackBar: MatSnackBar
  ) {}

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      duration: 0,
      panelClass: [className]
    });
  }

  showAlert() {
    this.notificationService.alert("an alert", "notice", () => {
      this.notificationService.success("alert oked");
    });
  }

  showConfirm() {
    this.notificationService.confirmation("it will be gone forever", () => {
      this.notificationService.success("confirm oked");
    },
    'Are you sure?',
     () => {
      this.notificationService.error("confirm canceled");
    });
  }
}

 */
