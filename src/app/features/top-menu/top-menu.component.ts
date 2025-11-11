import {Component, HostBinding, inject, Input, OnDestroy} from '@angular/core';
import {Roles} from "../../domain/roles";
import {Header} from "../../domain/header";
import {MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Panel} from "../../domain/panel";
import {Menu} from "../../domain/menu";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../domain/apartment-detail";
import {Colors} from "../../domain/colors";
import {filter, takeUntil} from "rxjs/operators";
import {DetailDialogComponent} from "../dialogs/detail-dialog/detail-dialog.component";
import {NgIf} from "@angular/common";
import {Subject} from "rxjs";
import {ApartmentStore} from "../../services/apartments-store.service";
import {AuthStore} from "../../services/authentication/auth-store";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'top-menu',
  imports: [
    MatIconButton,
    MatIcon,
    RouterLink,
    RouterLinkActive,
    MatFabButton,
    NgIf
  ],
  templateUrl: './top-menu.component.html',
  styleUrl: './top-menu.component.scss'
})
export class TopMenuComponent implements OnDestroy{

  readonly store = inject(ApartmentStore);
  readonly authStore = inject(AuthStore);
  readonly dialog = inject(MatDialog);

  @Input() canEdit: boolean = false;
  @Input() header: Header | null = null
  @Input() selectedIso: string | null | undefined = "";

  @HostBinding("style.--direction")
  @Input() direction: string = "";

  unsubscribe$ = new Subject<void>();
  protected readonly Roles = Roles;

  createMenuDetail(header: Header | null) {
    if (header) {

      const max = header.menus.reduce((acc, val) => {
        return acc.orderNum > val.orderNum ? acc : val;
      });

      const panel: Partial<Panel> = {};
      const menu: Partial<Menu> = {mainId: header.main.id, orderNum: max.orderNum + 1};

      const detail: Partial<ApartmentDetail> = {topMenu: menu, sideMenu: panel};
      const color: Partial<Colors> = {
        primaryColor: header.colors.primaryColor,
        secondaryColor: header.colors.secondaryColor,
      };

      const data: ApartmentDetailDialogData = {
        languages: header.iso.map(iso => iso.iso),
        detail: detail,
        colors: color,
        newMenuOrderNum: header.menus[header.menus.length - 1].orderNum + 1
      };

      this.openApartmentDetailDialog(data).pipe(
          filter(val => !!val),
          takeUntil(this.unsubscribe$)
      ).subscribe(detailProps => {

            console.log("tu nema", detailProps);

          this.store.createDetailEffect(detailProps);
      }

      );
    }
  }

  openApartmentDetailDialog(data?: ApartmentDetailDialogData) {
    const dialogRef = this.dialog.open(DetailDialogComponent, {
      width: '420px',
      data: {
        ...data
      },
    });
    return dialogRef.afterClosed();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

}
