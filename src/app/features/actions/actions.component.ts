import {Component, HostBinding, inject, Input, OnDestroy} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {Side} from "../../domain/side";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Layout} from "../../domain/layout";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../domain/apartment-detail";
import {filter, takeUntil} from "rxjs/operators";
import {Header} from "../../domain/header";
import {ApartmentStore} from "../../services/apartments-store.service";
import {ConformationDialogComponent} from "../dialogs/conformation-dialog/conformation-dialog.component";
import {Colors} from "../../domain/colors";
import {Hosts} from "../../domain/hosts";
import {ApartmentItem, ApartmentItemDialogData} from "../../domain/apartment-item";
import {ItemDialogComponent} from "../dialogs/item-dialog/item-dialog.component";
import {DetailDialogComponent} from "../dialogs/detail-dialog/detail-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthStore} from "../../services/authentication/auth-store";
import {Subject} from "rxjs";
import {Menu} from "../../domain/menu";
import {Apartment} from "../../domain/apartment";
import {ApartmentDialogComponent} from "../dialogs/apartment-dialog/apartment-dialog.component";
import {Language} from "../../domain/language";
import {defaultIso} from "../../domain/countries-iso";

@Component({
  selector: 'actions',
  imports: [
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatButtonToggleGroup,
    MatButtonToggle,
    TranslatePipe,
  ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent implements OnDestroy {

  private store = inject(ApartmentStore);
  private dialog = inject(MatDialog);
  private translateService = inject(TranslateService);
  private authStore = inject(AuthStore);

  @Input() activeDetail: ApartmentDetail | null = null;
  @Input() header: Header | null = null;
  @Input() selectedIso: string = defaultIso;

  @HostBinding("style.--direction")
  @Input() direction: string = "";

  unsubscribe$ = new Subject<void>();


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }


  conformationDialog() {
    const dialogRef = this.dialog.open(ConformationDialogComponent, {
      width: '320px',
      data: this.translateService.instant('delete.detail')
    });
    return dialogRef.afterClosed();
  }

  createNewItem(detail: ApartmentDetail | null, colors: Colors | null | undefined, host: Hosts | undefined) {
    if (detail) {
      const item: Partial<ApartmentItem> = {detailId: detail.id};
      const data: ApartmentItemDialogData = {
        languages: this.header?.main.languages,
        item: item,
        selectedIso: this.selectedIso,
        colors: colors,
        roles: this.authStore.userRoles,
        host: host,
        fonts: this.header?.main.fonts
      };

      this.openDialogItem(data).pipe(
          filter(val => !!val),
          takeUntil(this.unsubscribe$)
      ).subscribe(detailProps => {
            if (detailProps.id) {
              this.store.updateItemEffect(detailProps)
            } else {
              this.store.createItemEffect(detailProps)
            }

          }
      );
    }
  }

  openDialogItem(item?: ApartmentItemDialogData) {

    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '31rem',
      data: {
        ...item
      },
    });

    return dialogRef.afterClosed();
  }


  updateTitlesAndIcons(header: Header | null, detail: ApartmentDetail | null) {
    const selectedLanguages: Language[] | undefined = header?.main.languages;
    const partial: Partial<ApartmentDetail> = {...detail}
    const data: Partial<ApartmentDetailDialogData> = {
      languages: selectedLanguages,
      selectedIso: this.selectedIso,
      products:header?.main.products,
      fonts: header?.main.fonts,
      detail: partial,
      colors: header?.main.colors,
      host: header?.main.host,
    }

    this.openApartmentDetailDialog(data).pipe(
        filter(val => !!val),
        takeUntil(this.unsubscribe$)
    ).subscribe(detailProps => {
          if (detailProps.id) {
            this.store.updateDetailEffect(detailProps);
          }
        }
    );

  }

  openApartmentDetailDialog(data?: Partial<ApartmentDetailDialogData>) {
    const dialogRef = this.dialog.open(DetailDialogComponent, {
      maxWidth: '29rem',
      maxHeight: '30rem',
      data: {
        ...data
      },
    });
    return dialogRef.afterClosed();
  }

  onChangeColumns($event: any, detail: ApartmentDetail | null) {
    const detailUpdate: Partial<ApartmentDetail> = {
      ...detail,
      items: undefined,
     // iso: undefined,
      columns: $event.value
    }
    this.store.updateDetailEffect(detailUpdate);
  }

  deleteDetail(detail: ApartmentDetail | null) {
    this.conformationDialog().pipe(
        filter(val => !!val),
        takeUntil(this.unsubscribe$)
    ).subscribe(confirm => {
          if (confirm) {
            if (detail) {
              this.store.deleteDetailEffect(detail)
            }
          }
        }
    );
  }

  onChangeBackgroundColor($event: any, detail: ApartmentDetail | null) {
    const detailUpdate: Partial<ApartmentDetail> = {
      ...detail,
      items: undefined,
     // iso: undefined,
      backgroundColor: $event.value,
    }
    this.store.updateDetailEffect(detailUpdate);
  }

  addToRightMenuPanel(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.topMenu, panels: undefined, side: Side.RIGHT}
    this.store.updateMenuEffect(menuUpdate);
  }

  addToLeftMenuPanel(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.topMenu, panels: undefined, side: Side.LEFT}
    this.store.updateMenuEffect(menuUpdate);
  }

  fullScreen(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.topMenu, panels: undefined, layout: Layout.FULL}
    this.store.updateMenuEffect(menuUpdate);
  }

  onlyOne(menus: Menu[] | undefined) {
    if (menus) {
      if (menus.length) {
        if (menus.length < 2) {
          return menus[0].panels.length < 2;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  panelOn(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.topMenu, panels: undefined, panelOn: true}
    this.store.updateMenuEffect(menuUpdate);
  }

  panelOff(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.topMenu, panels: undefined, panelOn: false}
    this.store.updateMenuEffect(menuUpdate);
  }

  center(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.topMenu, panels: undefined, layout: Layout.CENTER}
    this.store.updateMenuEffect(menuUpdate);
  }


  openApartmentDialog(apartment?: Partial<Apartment>) {
    const dialogRef = this.dialog.open(ApartmentDialogComponent, {
      width: '50rem',
      data: {
        ...apartment
      },
    });
    return dialogRef.afterClosed();
  }

  changeHeader(main: Apartment | undefined) {
  //  console.log("changeHeader dialog enter", main);
    this.openApartmentDialog(main).pipe(
        filter(val => !!val),
        takeUntil(this.unsubscribe$)
    ).subscribe(detailProps => {
          //console.log("changeHeader dialog finish", detailProps);
          this.store.createMainEffect(detailProps);
        }
    );
  }

  protected readonly Side = Side;
  protected readonly Layout = Layout;
}
