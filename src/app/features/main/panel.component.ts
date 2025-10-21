import {Component, HostBinding, inject, Input, OnDestroy} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {filter, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {Editor} from "ngx-editor";
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {WidgetComponent} from "../widget/widget.component";
import {ApartmentStore} from "../../services/apartments-store.service";
import {Colors} from "../../domain/colors";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../domain/apartment-detail";
import {ConformationDialogComponent} from "../dialogs/conformation-dialog/conformation-dialog.component";
import {ApartmentItem, ApartmentItemDialogData} from "../../domain/apartment-item";
import {ItemDialogComponent} from "../dialogs/item-dialog/item-dialog.component";
import {Header} from "../../domain/header";
import {DetailDialogComponent} from "../dialogs/detail-dialog/detail-dialog.component";
import {Widget} from "../widget/widget";
import {ChipMap} from "../../domain/chip-map";
import {ApartmentDetailIso} from "../../domain/apartment-detail-iso";
import {defaultIso} from "../../domain/countries-iso";
import {Menu} from "../../domain/menu";
import {Side} from "../../domain/side";
import {Layout} from "../../domain/layout";
import {LayoutState} from "../../domain/layout-state";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {Hosts} from "../../domain/hosts";
import {AuthStore} from "../../services/authentication/auth-store";

@Component({
  selector: 'panel',
  imports: [
    MatCard,
    MatCardHeader,
    FormsModule,
    MatButton,
    MatIcon,
    MatCardContent,
    CdkDropList,
    WidgetComponent,
    CdkDrag,
    MatChipListbox,
    MatChipOption,
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent implements OnDestroy {
  private store = inject(ApartmentStore);
  private authStore = inject(AuthStore);
  private dialog = inject(MatDialog);
  private translateService = inject(TranslateService);

  @Input() activeDetail: ApartmentDetail | null = null;
  @Input() header: Header | null = null;

  @HostBinding("style.--grid-col")
  cssGridCol: number = 1;

  @HostBinding("style.--right-padding")
  cssRightPadding: any = "0";

  @HostBinding("style.--left-padding")
  cssLeftPadding: any = "0";

  @HostBinding("style.--corner-radius")
  cssCornerRadius: string = "16px";

  @Input()
  @HostBinding("style.--background-color")
  backgroundColor: string = "";

  @Input()
  @HostBinding("style.--actions-border-color")
  actionsBorderColor: string = "";

  @Input() set cornerRadius(cornerRadius: number | null) {
    if (cornerRadius) {
      this.cssCornerRadius = cornerRadius + "px";
    }
  }

  @Input() set stateLayout(stateLayout: LayoutState | undefined) {
    if (stateLayout) {
      if (stateLayout?.gapL === 0 && stateLayout?.menuL === 0) {
        this.cssLeftPadding = "10px";
      } else {
        this.cssLeftPadding = "0";
        if (stateLayout.panelL !== 0) {
          this.cssLeftPadding = "10px";
        }
      }

      if (stateLayout?.gapR === 0 && stateLayout?.menuR === 0) {
        this.cssRightPadding = "10px";
      } else {
        this.cssRightPadding = "0";
        if (stateLayout.panelR !== 0) {
          this.cssRightPadding = "10px";
        }
      }
    }
  }

  backgroundColorSwitch(onOff: boolean, detail: ApartmentDetail | null) {
    const detailUpdate: Partial<ApartmentDetail> = {
      ...detail,
      items: undefined,
      iso: undefined,
      backgroundColorOn: onOff,
    }
    this.store.updateDetailEffect(detailUpdate);
  }

  fillBackground($event: any, detail: ApartmentDetail | null) {
    if ($event.value) {
      this.backgroundColorSwitch(true, detail);
    } else {
      this.backgroundColorSwitch(false, detail);
    }
  }

  @Input() set col(col: number | null) {
    if (col) {
      this.cssGridCol = col;
    }
  }

  @Input()
  loggedIn: boolean = false;

  @Input()
  selectedIso: string = defaultIso;

  unsubscribe$ = new Subject<void>();
  local: boolean = true;
  apartment: string = "";
  editor: Editor = new Editor();

  constructor() {
    console.log("PANEL load");
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.editor.destroy();
  }

  deleteDetail(detail: ApartmentDetail | null) {
    this.conformationDialog().pipe(
        filter(val => !!val),
        takeUntil(this.unsubscribe$)
    ).subscribe(confirm => {
          if (confirm) {
            if (detail) {
              console.log("delete Detail")
              this.store.deleteDetailEffect(detail)
            }
          }
        }
    );
  }

  conformationDialog() {
    const dialogRef = this.dialog.open(ConformationDialogComponent, {
      width: '320px',
      data: this.translateService.instant('delete.detail')
    });
    return dialogRef.afterClosed();
  }

  createNewItem(detail: ApartmentDetail | null, colors: Colors | null | undefined, host: Hosts | undefined) {
    console.log("(click) createItem detail", detail);

    if (detail) {
      const item: Partial<ApartmentItem> = {detailId: detail.id};
      const data: ApartmentItemDialogData = {
        languages: detail.iso.map(iso => iso.iso),
        item: item,
        colors: colors,
        roles: this.authStore.userRoles,
        host: host
      };

      this.openDialogItem(data).pipe(
          filter(val => !!val),
          takeUntil(this.unsubscribe$)
      ).subscribe(detailProps => {
            console.log("props", detailProps);
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
      width: '500px',
      data: {
        ...item
      },
    });

    return dialogRef.afterClosed();
  }


  updateDetail(header: Header | null, detail: ApartmentDetail | null) {
    const selectedLanguages: string[] | undefined = header?.languages;
    const partial: Partial<ApartmentDetail> = {...detail}
    const data: Partial<ApartmentDetailDialogData> = {
      languages: selectedLanguages,
      detail: partial,
      colors: header?.colors
    }

    this.openApartmentDetailDialog(data).pipe(
        filter(val => !!val),
        takeUntil(this.unsubscribe$)
    ).subscribe(detailProps => {
          if (detailProps.id) {
            this.store.updateDetailEffect(detailProps)
          }
        }
    );

  }

  openApartmentDetailDialog(data?: Partial<ApartmentDetailDialogData>) {
    const dialogRef = this.dialog.open(DetailDialogComponent, {
      width: '420px',
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
      iso: undefined,
      columns: $event.value
    }
    this.store.updateDetailEffect(detailUpdate);
  }

  drop(event: CdkDragDrop<ApartmentItem[]>): void {
    //  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    /* } else {
       transferArrayItem(event.previousContainer.data,
         event.container.data,
         event.previousIndex,
         event.currentIndex);
     }*/
  }

  transformItemToWidget(detail: ApartmentDetail, item: ApartmentItem, colors: Colors | undefined, host: Hosts | undefined): Widget {

    return {
      item: item,
      languages: detail.iso.map(iso => iso.iso),
      component: ChipMap.get(item.chip),
      colors: colors,
      host: host
    };
  }

  getTitle(country: string | null, iso: ApartmentDetailIso[] | undefined) {
    return iso?.find(iso => iso.iso === country)?.title;
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

  addToRightMenuPanel(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.menu, panels: undefined, side: Side.RIGHT}
    this.store.updateMenuEffect(menuUpdate);
  }

  addToLeftMenuPanel(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.menu, panels: undefined, side: Side.LEFT}
    this.store.updateMenuEffect(menuUpdate);
  }

  panelOn(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.menu, panels: undefined, panelOn: true}
    this.store.updateMenuEffect(menuUpdate);
  }

  panelOff(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.menu, panels: undefined, panelOn: false}
    this.store.updateMenuEffect(menuUpdate);
  }

  center(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.menu, panels: undefined, layout: Layout.CENTER}
    this.store.updateMenuEffect(menuUpdate);
  }

  fullScreen(detail: ApartmentDetail | null) {
    const menuUpdate: Partial<Menu> = {...detail?.menu, panels: undefined, layout: Layout.FULL}
    this.store.updateMenuEffect(menuUpdate);
  }


  protected readonly Side = Side;
  protected readonly Layout = Layout;
}
