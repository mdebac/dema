import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CustomersTableComponent} from "../tables/customers-table/customers-table.component";
import {LetDirective} from "@ngrx/component";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFabButton} from "@angular/material/button";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {TranslatePipe} from "@ngx-translate/core";
import {ApartmentStore} from "../../services/apartments-store.service";
import {NotificationService} from "../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {AuthStore} from "../../services/authentication/auth-store";
import {Subject} from "rxjs";
import {filter, takeUntil} from "rxjs/operators";
import {Roles} from "../../domain/roles";
import {Apartment} from "../../domain/apartment";
import {ApartmentDialogComponent} from "../dialogs/apartment-dialog/apartment-dialog.component";
import {MatIcon} from "@angular/material/icon";
import {Hosts} from "../../domain/hosts";

@Component({
  selector: 'dashboard-users',
  imports: [
    CustomersTableComponent,
    LetDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFabButton,
    MatGridList,
    MatGridTile,
    MatIcon,
    TranslatePipe
  ],
  templateUrl: './dashboard-users.component.html',
  styleUrl: './dashboard-users.component.scss',
})
export class DashboardUsersComponent  implements OnInit, OnDestroy {
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
  shrinkMenu$ = this.store.shrinkMenu$;
  stateLayout$ = this.store.dashboardLayout$;
  selectedIso$ = this.store.selectedIso$;
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
          // window.location.reload();
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
