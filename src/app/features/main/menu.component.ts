import {Component, HostBinding, inject, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
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
import {QuillViewComponent} from "ngx-quill";


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
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatIcon,
        MatButton,
        MatIconButton,
        NgClass,
        QuillViewComponent
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
            if(this.activeDetail?.topMenu?.side){


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
            }
        }
    }

    @Input()
    loggedIn: boolean = false;

    @Input()
    selectedIso: string | null = defaultIso;

    constructor() {
        console.log("Menu load");
    }

    slides: SlideInterface[] = [
        {url: '/assets/dubrovnik2.jpg', title: 'beach'},
        {url: '/assets/dubrovnik1.png', title: 'boat'},
        {url: '/assets/dubrovnik3.png', title: 'boat'},
    ];

    goTo(menuUrl: string | undefined, panelUrl: string) {
        this.router.navigate([menuUrl, panelUrl]);
    }

    get menuSide(){
        return this.activeDetail?.topMenu.side;
    }
    createPanelDetail(header: Header | null, detail: ApartmentDetail | null) {
        if (header) {

            const max = detail?.topMenu?.panels?.reduce((acc, val) => {
                return acc.orderNum > val.orderNum ? acc : val;
            });
            if (max) {
                const panel: Partial<Panel> = {menuId: detail?.topMenu?.id, orderNum: max.orderNum + 1};
                const newDetail: Partial<ApartmentDetail> = {topMenu: detail?.topMenu, sideMenu: panel};

                const color: Partial<Colors> = {
                    primaryColor: header.main.colors.primaryColor,
                    secondaryColor: header.main.colors.secondaryColor,
                };

                const data: Partial<ApartmentDetailDialogData> = {
                    languages: header.main.languages,
                    fonts: header.main.fonts,
                    detail: newDetail,
                    colors: color,
                    host: header.main.host,
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

    protected readonly Roles = Roles;
    protected readonly Layout = Layout;
    protected readonly Side = Side;
}
