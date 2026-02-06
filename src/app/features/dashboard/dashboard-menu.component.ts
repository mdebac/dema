import {Component, HostBinding, inject, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {SlideInterface} from "../imageSlider/types/slide.interface";
import {defaultIso} from "../../domain/countries-iso";
import {ApartmentDetailDialogData} from "../../domain/apartment-detail";
import {Header} from "../../domain/header";
import {Router} from "@angular/router";
import {Panel} from "../../domain/panel";
import {DetailDialogComponent} from "../dialogs/detail-dialog/detail-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {Roles} from "../../domain/roles";
import {ApartmentStore} from "../../services/apartments-store.service";
import {Layout} from "../../domain/layout";
import {Side} from "../../domain/side";
import {Chip} from "../../domain/chip.enum";
import {Menu} from "../../domain/menu";
import {TopMenuType} from "../../domain/top-menu-type";

@Component({
  selector: 'dashboard-menu',
  imports: [

  ],
  templateUrl: './dashboard-menu.component.html',
  styleUrl: './dashboard-menu.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DashboardMenuComponent implements OnDestroy{

  router = inject(Router);
  dialog = inject(MatDialog);
  store = inject(ApartmentStore);

  unsubscribe$ = new Subject<void>();

  @Input() roles: string[] | null = null;

  @Input() header: Header | null = null;

  @HostBinding("style.--corner-radius")
  cssCornerRadius: string = "16px";

  @Input()
  @HostBinding("style.--justify-menu")
  justifyMenu: string = "left";

  @HostBinding("style.--justify-icon-close")
  justifyIconClose: string = "justify-icon-close";

  @HostBinding("style.--sidenav-margin-left")
  sidenavMarginLeft: any = "sidenav-margin-left";

  @HostBinding("style.--sidenav-margin-right")
  sidenavMarginRight: any = "sidenav-margin-right";

  @HostBinding("style.--mim-padding-right")
  mimPaddingRight: any = "mim-padding-right";

  @HostBinding("style.--mim-padding-left")
  mimPaddingLeft: any = "mim-padding-left";

  @Input()
  @HostBinding("style.--padding-top")
  paddingTop: any = "0";

  @HostBinding("style.--active-menu-link-border-radius")
  activeMenuLinkBorderRadius: any = "active-menu-link-border-radius";


  @Input() startDetailAnimation: boolean = true;
  @Input() finishDetailAnimation: boolean = true;
  @Input() closedMenu: boolean = true;
  @Input() disableAddingNewPanels: boolean = true;

  @Input() set cornerRadius(cornerRadius: number | null) {
    if (cornerRadius) {
      this.cssCornerRadius = cornerRadius + "px";
    }
  }

  @Input()
  loggedIn: boolean = false;

  @Input()
  selectedIso: string = defaultIso;

  constructor() {
    console.log("Menu load");
  }



/*

        if(this.activeDetail.topMenu.side === Side.RIGHT){
          this.activeMenuLinkBorderRadius = "0 15px 15px 0";
        }else{
          this.activeMenuLinkBorderRadius = "15px 0 0 15px";
        }

        //  this.justifyMenu = this.activeDetail?.topMenu?.side;

        //   console.log("this.activeDetail2?.menu?.side", this.activeDetail?.menu?.side);
        //TODO
        this.justifyIconClose = this.activeDetail?.topMenu?.side === Side.RIGHT ? Side.LEFT.toLowerCase() : Side.RIGHT.toLowerCase();

        this.sidenavMarginLeft  = this.activeDetail?.topMenu?.side === Side.RIGHT ? "5px" : 0;
        this.sidenavMarginRight = this.activeDetail?.topMenu?.side === Side.RIGHT ? 0 : "5px";
        //
        // this.sidenavMarginLeft  = this.activeDetail2?.menu?.side === Side.RIGHT ? "5px" : 0;
        //  this.sidenavMarginRight = this.activeDetail2?.menu?.side === Side.RIGHT ? 0 : "5px";


        // this.mimPaddingLeft = this.activeDetail2?.menu?.side === Side.RIGHT ? "1rem" : 0;
        // this.mimPaddingRight = this.activeDetail2?.menu?.side === Side.RIGHT ? 0 : "0.5rem";
        //
        this.mimPaddingLeft = this.activeDetail?.topMenu?.side === Side.RIGHT ? 0 : "1rem";
        this.mimPaddingRight = this.activeDetail?.topMenu?.side === Side.RIGHT ? "0.5rem" : 0;
 */
  slides: SlideInterface[] = [
    {url: '/assets/dubrovnik2.jpg', title: 'beach'},
    {url: '/assets/dubrovnik1.png', title: 'boat'},
    {url: '/assets/dubrovnik3.png', title: 'boat'},
  ];

  goTo(url: string) {
    this.router.navigate(['my', url]);
  }

  // get menuSide(){
  //   return this.activeDetail?.topMenu.side;
  // }




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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    // this.breadcrumbs.removeItem('apartmants')
  }

  resolveClass(i: number) {
    if (i === 0) {
      return 'linkic-first'
    } else {
      return 'linkic'
    }
  }

  resolveActiveClass(i: number) {
    if (i === 0) {
      return 'linkic-active-first'
    } else {
      return 'linkic-active'
    }
  }

  toggleCollapse(): void {
    this.store.shrinkMenu(false);
  }

  closeSidenav(): void {
    this.store.shrinkMenu(true);
  }

  getSideMenuLabel(title: string, description: string) {
    let output: string = "";
    if (title) {
      output = output + title;
    }
    if (description) {
      output = output + description;
    }
    return output;
  }

  getSideMenuLabelWhenClosed(title: string) {
    let output: string = "";
    if (title) {
      output = output + title;
    }
    output = output.replace("ql-size-huge", "ql-size-large");
    output = output.replace("ql-size-normal", "ql-size-large");
    if(output.includes("<p>")){
      output = output.replace("<p>","<p class=\"ql-align-center\">");
    }
    return output;
  }

  moveUp(panel: Panel | undefined | null, beforeId: number | undefined | null){
    const panelPayload = {
      ...panel,
      chip: Chip.MOVE_LEFT,
      beforeId:beforeId
    } as Partial<Panel>;

    console.log("moveUp");
    this.store.moveSideMenuEffect(panelPayload);
  }

  moveDown(panel: Panel | undefined | null, nextId: number | undefined | null){
    const panelPayload = {
      ...panel,
      chip: Chip.MOVE_RIGHT,
      nextId:nextId
    } as Partial<Panel>;

    console.log("moveDown");
    this.store.moveSideMenuEffect(panelPayload);
  }

  calculateBeforeId(index: number, menu: Partial<Menu> | null | undefined){
    let beforeId = null;
    if(index !== 0 && menu?.panels){
      beforeId = menu?.panels.at(index-1)?.id;
    }
    return beforeId;
  }

  calculateNextId(index: number, menu: Partial<Menu> | null | undefined){
    let nextId = null;
    if(menu?.panels){
      const tempPanel = menu?.panels.at(index + 1);
      if(tempPanel){
        nextId = tempPanel.id;
      }
      return nextId;
    }
    return nextId;
  }

  protected readonly Roles = Roles;
  protected readonly Layout = Layout;
  protected readonly Side = Side;
  protected readonly TopMenuType = TopMenuType;
}
