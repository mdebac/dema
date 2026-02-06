import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {LetDirective} from "@ngrx/component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {ApartmentStore} from "../../services/apartments-store.service";
import {NotificationService} from "../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {filter, takeUntil} from "rxjs/operators";
import {QuillViewComponent} from "ngx-quill";
import {Side} from "../../domain/side";
import {ProductType} from "../../domain/product-type";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'search',
  imports: [
    LetDirective,
    MatGridList,
    MatGridTile,
    MatIcon,
    QuillViewComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  private store = inject(ApartmentStore);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);

  unsubscribe$ = new Subject<void>();
  error$ = this.store.error$.pipe(filter((e) => !!e));
  header$ = this.store.header$;


  // isManager = this.authStore.authorize(Roles.MANAGER);
  // isAdmin = this.authStore.authorize(Roles.ADMIN);
  // isUser = this.authStore.authorize(Roles.USER);

  ngOnInit() {
    console.log("SearchComponent ngOnInit");
    // if(this.isAdmin || this.isManager){
    //   //this.store.loadCustomersEffect();
    //   //this.store.fetchProductsEffect();
    // }
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

  getProductsMenuLabel(text: string){

  }

  resolveClass(i: number) {
    if (i === 0) {
      return 'linkic-first'
    } else {
      return 'linkic'
    }
  }

  filterProduct(type: ProductType){
    this.store.selectProductFilter(type);
  }

  protected readonly Side = Side;
}
