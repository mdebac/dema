import {
  Component,
  HostBinding,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from "@angular/core";
import {ApartmentStore} from "../../services/apartments-store.service";
import {Widget} from "./widget";
import {ApartmentItem, ApartmentItemDialogData} from "../../domain/apartment-item";
import {filter, takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {Colors} from "../../domain/colors";
import { NgClass, NgIf, NgComponentOutlet } from "@angular/common";
import { MatMiniFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import {TokenService} from "../../services/token.service";
import {ConformationDialogComponent} from "../dialogs/conformation-dialog/conformation-dialog.component";
import {ItemDialogComponent} from "../dialogs/item-dialog/item-dialog.component";
import {ItemSettingsDialogComponent} from "../dialogs/item-settings-dialog/item-settings-dialog.component";
import {Chip} from "../../domain/chip.enum";
import {ApartmentDetail} from "../../domain/apartment-detail";
import {ChipMap} from "../../domain/chip-map";
import {TextComponent} from "./type/text/text.component";
import {ApartmentItemIso} from "../../domain/apartment-item-iso";

// @ts-ignore
@Component({
    selector: 'widget',
    templateUrl: './widget.component.html',
    styleUrls: ['./widget.component.scss'],
    imports: [
        NgClass,
        NgIf,
        MatMiniFabButton,
        MatIcon,
        NgComponentOutlet,
    ],
})
export class WidgetComponent implements OnDestroy, OnInit {
  private dialog = inject(MatDialog);
  private store = inject(ApartmentStore);
  private tokenService = inject(TokenService);
  private translateService = inject(TranslateService);

  private _data: Widget | undefined;
  elevation: string | undefined;
  loggedIn: boolean = true;
  @HostBinding("style.--rowSpan")
  rowSpan: number | undefined;
  @HostBinding("style.--colSpan")
  colSpan: number | undefined;
  @HostBinding("style.--cornerRadius")
  cornerRadius: string | undefined;
  @HostBinding("style.--minHeight")
  minHeight: string | undefined;
  @HostBinding("style.--backgroundColor")
  backgroundColor: string | undefined;

  @Input() columns: number | undefined;

  @Input() set data(value: Widget) {
    this._data = value;
    this.rowSpan = this._data?.item?.rowSpan ? this._data.item.rowSpan : 1;
    this.colSpan = this._data?.item?.colSpan ? this._data.item.colSpan : 1;
    this.cornerRadius = (this._data?.item?.cornerRadius ? this._data.item.cornerRadius : 10) + 'px';
    this.elevation = 'mat-elevation-z' + (this._data?.item?.elevation ? this._data.item.elevation : 0);
    this.minHeight = (this._data?.item?.minHeight ? this._data.item.minHeight : 100) + 'px';
    this.backgroundColor = this._data?.item?.backgroundColor ? this._data.item.backgroundColor : "";
  }

  @Input() selectedIso: string | null | undefined;

  get data(): Widget {

    if(this._data?.component){
      return this._data;
    }
    return this.transformItemToWidget();

  }

  get dataIso(): ApartmentItemIso[] {
    if(this._data?.item?.iso){
      return this._data.item.iso;
    }
    return [];
  }

  get dataId(): number {
    if(this._data?.item?.id){
      return this._data.item.id;
    }
    return 0;
  }
  transformItemToWidget(): Widget {
  //detail: ApartmentDetail, item: ApartmentItem, colors: Colors | undefined
    return {
      item: null,
      languages: null,
      component: TextComponent,
      colors: undefined,
    };
  }


  unsubscribe$ = new Subject<void>();

  updateItem(languages: string[] | undefined | null, colors: Colors | undefined, item: ApartmentItem  | undefined | null) {
    const partial: Partial<ApartmentItem> = {...item}
    const data: ApartmentItemDialogData = {
      languages: languages,
      item: partial,
      colors: colors
    }
    this.openDialogItem(data).pipe(
      filter(val => !!val),
      takeUntil(this.unsubscribe$)
    ).subscribe(detailProps =>    {
        console.log("props", detailProps);
        if(detailProps.id){
          this.store.updateItemEffect(detailProps)
        }else{
          this.store.createItemEffect(detailProps)
        }
      }
);
  }

    updateItemSettings(colors: Colors | undefined, item: ApartmentItem | undefined | null) {
      const partial: Partial<ApartmentItem> = {...item}
      const data: ApartmentItemDialogData = {
        languages: [],
        item: partial,
        colors: colors
      }

    this.openDialogItemSettings(data).pipe(
      filter(val => !!val),
      takeUntil(this.unsubscribe$)
    ).subscribe(detailProps => {
        console.log("(widget) updateItemSettings", detailProps);
        this.store.updateItemEffect(detailProps);
      }
    );
  }

  deleteItem(item: ApartmentItem | undefined | null) {
    this.conformationDialog().pipe(
      filter(val => !!val),
      takeUntil(this.unsubscribe$)
    ).subscribe(confirm => {
        if (confirm) {
          console.log("delete Item")
          if(item){
            this.store.deleteItemEffect(item)
          }
        }
      }
    );
  }

  conformationDialog() {
    const dialogRef = this.dialog.open(ConformationDialogComponent, {
      width: '320px',
      data: this.translateService.instant('delete.item')
    });
    return dialogRef.afterClosed();
  }


  ngOnInit() {
    this.loggedIn = this.tokenService.isTokenValid();
  }

  openDialogItem(data: ApartmentItemDialogData) {

    const dialogRef = this.dialog.open(ItemDialogComponent, {
      width: '500px',
      data: {
        ...data
      },
    });

    return dialogRef.afterClosed();
  }

  openDialogItemSettings(data: ApartmentItemDialogData | null) {

    const dialogRef = this.dialog.open(ItemSettingsDialogComponent, {
      width: '500px',
      data: {
        ...data
      },
    });

    return dialogRef.afterClosed();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }


  protected readonly Chip = Chip;
}
