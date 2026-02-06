import {Component, Host, HostBinding, inject, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Roles} from "../../domain/roles";
import {Header} from "../../domain/header";
import {MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Panel} from "../../domain/panel";
import {Menu} from "../../domain/menu";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../domain/apartment-detail";
import {Colors} from "../../domain/colors";
import {filter, takeUntil} from "rxjs/operators";
import {DetailDialogComponent} from "../dialogs/detail-dialog/detail-dialog.component";

import {Subject} from "rxjs";
import {ApartmentStore} from "../../services/apartments-store.service";
import {AuthStore} from "../../services/authentication/auth-store";
import {MatDialog} from "@angular/material/dialog";
import {NgClass} from "@angular/common";
import {QuillViewComponent} from "ngx-quill";
import {Side} from "../../domain/side";
import {Chip} from "../../domain/chip.enum";
import {defaultIso} from "../../domain/countries-iso";
import {Hosts} from "../../domain/hosts";
import {TopMenuType} from "../../domain/top-menu-type";
import {ProductType} from "../../domain/product-type";
import {ChooseProductDialogComponent} from "../dialogs/choose-product-dialog/choose-product-dialog.component";

@Component({
    selector: 'top-menu',
    imports: [
        MatIconButton,
        MatIcon,
        RouterLink,
        RouterLinkActive,
        QuillViewComponent,
        NgClass,
        MatMiniFabButton,
    ],
    templateUrl: './top-menu.component.html',
    styleUrl: './top-menu.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class TopMenuComponent implements OnDestroy {

    readonly store = inject(ApartmentStore);
    readonly authStore = inject(AuthStore);
    readonly dialog = inject(MatDialog);

    @Input() canEdit: boolean = false;
    @Input() header: Header | null = null
    @Input() selectedIso: string = defaultIso;
   // @Input() products: ProductType[] | Partial<ProductType>[] = [];
    @Input() activeDetail: ApartmentDetail | undefined | null;

    @HostBinding("style.--direction")
    @Input() direction: string = "";

    unsubscribe$ = new Subject<void>();
    protected readonly Roles = Roles;

    isAdmin = this.authStore.authorize(Roles.ADMIN);


    createMenuDetail(header: Header | null, type: TopMenuType) {

        if(type === TopMenuType.MENU){
            this.createMenu(header, type,undefined);
        }else{



            console.log("producti", this.header?.main.products);

            this.openProductDialog(this.header?.main.products).pipe(
                filter(val => !!val),
                takeUntil(this.unsubscribe$)
            ).subscribe(productId => {

                    this.createMenu(header, type, productId)
                }
            );

        }
    }

    isCreateMenuProductDisabled(products: ProductType[] | undefined):boolean{
        if(products){
            return products.length < 1;
        }
        return true;
    }

    createMenu(header: Header | null, type: TopMenuType, productId:number|undefined){

        if (header) {

            const max = header.menus.reduce((acc, val) => {
                return acc.orderNum > val.orderNum ? acc : val;
            });

            const panel: Partial<Panel> = {};
            const menu: Partial<Menu> = {
                productId: productId,
                type: type,
                mainId: header.main.id,
                orderNum: max.orderNum + 1
            };

            const detail: Partial<ApartmentDetail> = {topMenu: menu, sideMenu: panel};
            const color: Partial<Colors> = {
                primaryColor: header.main.primaryColor,
                secondaryColor: header.main.secondaryColor,
            };

            const data: ApartmentDetailDialogData = {
                products: header.main.products,
                languages: header.main.languages,
                fonts: header.main.fonts,
                selectedIso: this.selectedIso,
                detail: detail,
                colors: color,
                host: header.main.host,

                newMenuOrderNum: header.menus[header.menus.length - 1].orderNum + 1
            };

            this.openApartmentDetailDialog(data).pipe(
                filter(val => !!val),
                takeUntil(this.unsubscribe$)
            ).subscribe(detailProps => {
                    if (type != TopMenuType.MENU) {
                        this.store.createMenuProductEffect(detailProps);
                    } else {
                        this.store.createDetailEffect(detailProps);
                    }
                }
            );
        }

    }


    openApartmentDetailDialog(data?: ApartmentDetailDialogData) {
        const dialogRef = this.dialog.open(DetailDialogComponent, {
            maxWidth: '29rem',
            maxHeight: '30rem',
            data: {
                ...data
            },
        });
        return dialogRef.afterClosed();
    }

    //
    // openHotelDialog(data?: ApartmentDetailDialogData) {
    //     const dialogRef = this.dialog.open(DetailDialogComponent, {
    //         maxWidth: '29rem',
    //         maxHeight: '30rem',
    //         data: {
    //             ...data
    //         },
    //     });
    //     return dialogRef.afterClosed();
    // }

    openProductDialog(data?: ProductType[] | Partial<ProductType>[]) {

        const dialogRef = this.dialog.open(ChooseProductDialogComponent, {
            maxWidth: '29rem',
            maxHeight: '30rem',
            data: data,
        });
        return dialogRef.afterClosed();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    getTopMenuLabel(title: string) {
        let output: string = "";
        if (title) {
            output = output + title;
        }
        //    output = output.replace("ql-size-huge", "ql-size-large");
        //    output = output.replace("ql-size-normal", "ql-size-large");
        if (output.includes("<p>")) {
            output = output.replace("<p>", "<p class=\"ql-align-center\">");
        }
        return output;
    }

    calculateBeforeId(activeMenuId: number | undefined, menus: Menu[] | null | undefined) {
        let beforeId = null;
        const index: number | undefined = menus?.findIndex(m => m.id === activeMenuId);

        if (index && index !== 0) {
            beforeId = menus?.at(index - 1)?.id;
        }
        return beforeId;
    }

    calculateNextId(activeMenuId: number | undefined, menus: Menu[] | null | undefined) {
        let nextId = null;
        const index: number | undefined = menus?.findIndex(m => m.id === activeMenuId);
        if (index || index === 0) {
            const tempPanel = menus?.at(index + 1);
            if (tempPanel) {
                nextId = tempPanel.id;
            }
        }
        return nextId;
    }

    moveRight(menu: Menu | undefined | null, nextId: number | undefined | null) {
        const payload = {
            ...menu,
            chip: Chip.MOVE_RIGHT,
            nextId: nextId
        } as Partial<Menu>;

        console.log("moveRight");
        this.store.moveTopMenuEffect(payload);
    }

    moveLeft(menu: Menu | undefined | null, beforeId: number | undefined | null) {
        const payload = {
            ...menu,
            chip: Chip.MOVE_LEFT,
            beforeId: beforeId
        } as Partial<Menu>;

        console.log("moveLeft");
        this.store.moveTopMenuEffect(payload);
    }

    protected readonly Side = Side;
    protected readonly Host = Host;
    protected readonly Hosts = Hosts;
    protected readonly TopMenuType = TopMenuType;
}

// createHotel(header: Header | null) {
//     if (header) {
//
//         const max = header.menus.reduce((acc, val) => {
//             return acc.orderNum > val.orderNum ? acc : val;
//         });
//
//         const panel: Partial<Panel> = {};
//         const menu: Partial<Menu> = {type: TopMenuType.HOTEL, mainId: header.main.id, orderNum: max.orderNum + 1};
//
//         const detail: Partial<ApartmentDetail> = {topMenu: menu, sideMenu: panel};
//         const color: Partial<Colors> = {
//             primaryColor: header.main.primaryColor,
//             secondaryColor: header.main.secondaryColor,
//         };
//
//         const data: ApartmentDetailDialogData = {
//             languages: header.main.languages,
//             fonts: header.main.fonts,
//             selectedIso: this.selectedIso,
//             detail: detail,
//             colors: color,
//             host: header.main.host,
//             newMenuOrderNum: header.menus[header.menus.length - 1].orderNum + 1
//         };
//
//         this.openHotelDialog(data).pipe(
//             filter(val => !!val),
//             takeUntil(this.unsubscribe$)
//         ).subscribe(detailProps => {
//                 this.store.createDetailEffect(detailProps);
//             }
//         );
//     }
// }

//createAutoOglas(header: Header | null) {
// if (header) {
//
//     const max = header.menus.reduce((acc, val) => {
//         return acc.orderNum > val.orderNum ? acc : val;
//     });
//
//     const panel: Partial<Panel> = {};
//     const menu: Partial<Menu> = {mainId: header.main.id, orderNum: max.orderNum + 1};
//
//     const detail: Partial<ApartmentDetail> = {topMenu: menu, sideMenu: panel};
//     const color: Partial<Colors> = {
//         primaryColor: header.main.primaryColor,
//         secondaryColor: header.main.secondaryColor,
//     };
//
//     const data: ApartmentDetailDialogData = {
//         languages: header.main.languages,
//         fonts:header.main.fonts,
//         selectedIso:this.selectedIso,
//         detail: detail,
//         colors: color,
//         host: header.main.host,
//         newMenuOrderNum: header.menus[header.menus.length - 1].orderNum + 1
//     };
//
//     this.openHotelDialog(data).pipe(
//         filter(val => !!val),
//         takeUntil(this.unsubscribe$)
//     ).subscribe(detailProps => {
//             this.store.createHotelEffect(detailProps);
//         }
//     );
// }}
