import {Component, HostBinding, inject, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Roles} from "../../domain/roles";
import {Header} from "../../domain/header";
import {MatIconButton} from "@angular/material/button";
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

@Component({
    selector: 'top-menu',
    imports: [
        MatIconButton,
        MatIcon,
        RouterLink,
        RouterLinkActive,
        QuillViewComponent,
        NgClass,
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
                primaryColor: header.main.primaryColor,
                secondaryColor: header.main.secondaryColor,
            };

            const data: ApartmentDetailDialogData = {
                languages: header.main.languages,
                fonts:header.main.fonts,
                detail: detail,
                colors: color,
                host: header.main.host,
                newMenuOrderNum: header.menus[header.menus.length - 1].orderNum + 1
            };

            this.openApartmentDetailDialog(data).pipe(
                filter(val => !!val),
                takeUntil(this.unsubscribe$)
            ).subscribe(detailProps => {
                    this.store.createDetailEffect(detailProps);
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
        if(output.includes("<p>")){
            output = output.replace("<p>","<p class=\"ql-align-center\">");
        }
        return output;
    }

    protected readonly Side = Side;
}
