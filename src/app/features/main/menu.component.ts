import {Component, HostBinding, inject, Input, OnDestroy} from '@angular/core';
import {SlideInterface} from "../imageSlider/types/slide.interface";
import {filter, takeUntil} from "rxjs/operators";
import {defaultIso} from "../../domain/countries-iso";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../domain/apartment-detail";
import {Header} from "../../domain/header";
import {MatButton, MatIconButton} from "@angular/material/button";
import {Router} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {Panel} from "../../domain/panel";
import {Colors} from "../../domain/colors";
import {DetailDialogComponent} from "../dialogs/detail-dialog/detail-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {Roles} from "../../domain/roles";
import {ApartmentStore} from "../../services/apartments-store.service";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Layout} from "../../domain/layout";
import {Side} from "../../domain/side";
import {NgClass} from "@angular/common";

// const fadeInOut = trigger('crossFade', [
//     state(
//         'in',
//         style({
//             opacity: 1,
//         })
//     ),
//     transition('void => *', [style({ opacity: 0 }), animate('1s ease-out')]),
//     transition('* => void', [animate('1s ease-out'), style({ opacity: 0 })]),
// ]);

const fadeInOut = trigger('fadeInOut', [
    state(
        'open',
        style({
            opacity: 1
        })
    ),
    state(
        'close',
        style({
            opacity: 0
        })
    ),
    transition('open => *', [animate('0.8s ease-out')]),
    transition('* => open', [animate('0.8s ease-in')]),
    transition('close => *', [animate('0.8s ease-out')]),
    transition('* => close', [animate('0.8s ease-in')]),
]);

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
    imports: [
        MatIcon,
        MatButton,
        MatIconButton,
        NgClass
    ],
    animations: [fadeInOut],
})
export class MenuComponent implements OnDestroy {

    router = inject(Router);
    dialog = inject(MatDialog);
    store = inject(ApartmentStore);

    unsubscribe$ = new Subject<void>();

    @Input() roles: string[] | null = null;

    @Input() header: Header | null = null;

    @HostBinding("style.--corner-radius")
    cssCornerRadius: string = "16px";

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

    @HostBinding("style.--active-menu-link-border-radius")
    activeMenuLinkBorderRadius: any = "active-menu-link-border-radius";

    activeDetail: ApartmentDetail | null = null;

    @Input() startDetailAnimation: boolean = true;
    @Input() finishDetailAnimation: boolean = true;
    @Input() closedMenu: boolean = true;
    @Input() disableAddingNewPanels: boolean = true;

    @Input() set cornerRadius(cornerRadius: number | null) {
        if (cornerRadius) {
            this.cssCornerRadius = cornerRadius + "px";
        }
    }

    @Input() set activeDetailInput(activeDetail: ApartmentDetail | null) {
        if (activeDetail) {
            this.activeDetail = {...activeDetail};
            if(this.activeDetail?.menu?.side){


                if(this.activeDetail.menu.side === Side.RIGHT){
                    this.activeMenuLinkBorderRadius = "0 15px 15px 0";
                }else{
                    this.activeMenuLinkBorderRadius = "15px 0 0 15px";
                }

                this.justifyMenu = this.activeDetail?.menu?.side;

             //   console.log("this.activeDetail2?.menu?.side", this.activeDetail?.menu?.side);
                //TODO
                this.justifyIconClose = this.activeDetail?.menu?.side === Side.RIGHT ? Side.LEFT.toLowerCase() : Side.RIGHT.toLowerCase();

                this.sidenavMarginLeft  = this.activeDetail?.menu?.side === Side.RIGHT ? "5px" : 0;
                this.sidenavMarginRight = this.activeDetail?.menu?.side === Side.RIGHT ? 0 : "5px";
                  //
                  // this.sidenavMarginLeft  = this.activeDetail2?.menu?.side === Side.RIGHT ? "5px" : 0;
                  //  this.sidenavMarginRight = this.activeDetail2?.menu?.side === Side.RIGHT ? 0 : "5px";


                // this.mimPaddingLeft = this.activeDetail2?.menu?.side === Side.RIGHT ? "1rem" : 0;
                // this.mimPaddingRight = this.activeDetail2?.menu?.side === Side.RIGHT ? 0 : "0.5rem";
                //
                this.mimPaddingLeft = this.activeDetail?.menu?.side === Side.RIGHT ? 0 : "1rem";
                this.mimPaddingRight = this.activeDetail?.menu?.side === Side.RIGHT ? "0.5rem" : 0;
            }
        }
    }

    @Input()
    loggedIn: boolean = false;

    @Input()
    selectedIso: string = defaultIso;

    constructor() {
        console.log("Menu load");
    }

    slides: SlideInterface[] = [
        {url: '/assets/dubrovnik2.jpg', title: 'beach'},
        {url: '/assets/dubrovnik1.png', title: 'boat'},
        {url: '/assets/dubrovnik3.png', title: 'boat'},
    ];

    goTo(menuUrl: string | undefined, panelUrl: string) {
        // console.log("goTo", menuUrl, panelUrl);
        this.router.navigate([menuUrl, panelUrl]);
    }

    get menuSide(){
        return this.activeDetail?.menu.side;
    }
    createPanelDetail(header: Header | null, detail: ApartmentDetail | null) {
        if (header) {

            const max = detail?.menu?.panels?.reduce((acc, val) => {
                return acc.orderNum > val.orderNum ? acc : val;
            });
            if (max) {
                const panel: Partial<Panel> = {menuId: detail?.menu?.id, orderNum: max.orderNum + 1};
                const newDetail: Partial<ApartmentDetail> = {menu: detail?.menu, panel: panel};

                const color: Partial<Colors> = {
                    primaryColor: header.colors.primaryColor,
                    secondaryColor: header.colors.secondaryColor,
                };

                const data: Partial<ApartmentDetailDialogData> = {
                    languages: header.iso.map(iso => iso.iso),
                    detail: newDetail,
                    colors: color,
                };

                this.openApartmentDetailDialog(data).pipe(
                    filter(val => !!val),
                    takeUntil(this.unsubscribe$)
                ).subscribe(detailProps =>

                    this.store.createDetailEffect(detailProps)
                );
            }
        }
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


    protected readonly Roles = Roles;
    protected readonly Layout = Layout;
    protected readonly Side = Side;
}
