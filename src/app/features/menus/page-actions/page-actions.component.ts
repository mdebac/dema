import {Component, HostBinding, inject, Input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {Side} from "../../../domain/side";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Layout} from "../../../domain/layout";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../../domain/apartment-detail";
import {filter, takeUntil} from "rxjs/operators";
import {Header} from "../../../domain/header";
import {ApartmentStore} from "../../../services/apartments-store.service";
import {ConformationDialogComponent} from "../../dialogs/conformation-dialog/conformation-dialog.component";
import {Colors} from "../../../domain/colors";
import {Hosts} from "../../../domain/hosts";
import {ApartmentItem, ApartmentItemDialogData} from "../../../domain/apartment-item";
import {ItemDialogComponent} from "../../dialogs/item-dialog/item-dialog.component";
import {DetailDialogComponent} from "../../dialogs/detail-dialog/detail-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthStore} from "../../../services/authentication/auth-store";
import {Subject} from "rxjs";
import {Menu} from "../../../domain/menu";
import {
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from "@angular/material/expansion";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Language} from "../../../domain/language";
import {defaultIso} from "../../../domain/countries-iso";


@Component({
  selector: 'page-actions',
    imports: [
        MatButton,
        MatButtonToggle,
        MatButtonToggleGroup,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatIcon,
        TranslatePipe,
        MatIcon,
    ],
  templateUrl: './page-actions.component.html',
  styleUrl: './page-actions.component.scss'
})
export class PageActionsComponent implements OnDestroy, OnInit {

    private store = inject(ApartmentStore);
    private dialog = inject(MatDialog);
    private fb = inject(FormBuilder);
    private translateService = inject(TranslateService);
    private authStore = inject(AuthStore);

    @Input() activeDetail: ApartmentDetail | null = null;
    @Input() header: Header | null = null;
    @Input() selectedIso: string = defaultIso;

    @HostBinding("style.--active-bg-color")
    @Input() activeBgColor: string | undefined = "";

    @HostBinding("style.--direction")
    @Input() direction: string = "";

    unsubscribe$ = new Subject<void>();

    isOpened: boolean = true;
    form: FormGroup;

    // selectedPictureTopMenu: string | null = null;
    // toBigTopMenuImage: string = "";
    // selectedTopMenuImage: File | null = null;
    //
    // selectedPictureSideMenu: string | null = null;
    // toBigSideMenuImage: string = "";
    // selectedSideMenuImage: File | null = null;

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    @ViewChild("updateTitlesAndIconsPanel", { static: false })
    updateTitlesAndIconsPanel: MatExpansionPanel | undefined;

    @ViewChild("createNewItemPanel", { static: false })
    createNewItemPanel: MatExpansionPanel | undefined;

    constructor() {

        this.form = this.fb.group({
            topMenuImage: [this.activeDetail?.topMenu.image],
            sideMenuImage: [this.activeDetail?.sideMenu.image],
        });

    }

    ngOnInit() {
        this.form.patchValue({topMenuImage: this.activeDetail?.topMenu.image});
        this.form.patchValue({sideMenuImage: this.activeDetail?.sideMenu.image});
    }

    conformationDialog() {
        const dialogRef = this.dialog.open(ConformationDialogComponent, {
            width: '320px',
            data: this.translateService.instant('delete.detail')
        });
        return dialogRef.afterClosed();
    }

    createNewItem(detail: ApartmentDetail | null, colors: Colors | null | undefined, host: Hosts | undefined) {
        if(this.createNewItemPanel){
            this.createNewItemPanel.toggle();
        }
        if (detail) {
            const item: Partial<ApartmentItem> = {detailId: detail.id};
            const data: ApartmentItemDialogData = {
                languages: this.header?.main.languages,
                item: item,
                selectedIso: this.selectedIso,
                fonts: this.header?.main.fonts,
                colors: colors,
                roles: this.authStore.userRoles,
                host: host
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

       if(this.updateTitlesAndIconsPanel){
           this.updateTitlesAndIconsPanel.toggle();
       }

        const selectedLanguages: Language[] | undefined = header?.main?.languages;
        const partial: Partial<ApartmentDetail> = {...detail}
        const data: Partial<ApartmentDetailDialogData> = {
            languages: selectedLanguages,
            products: header?.main.products,
            detail: partial,
            selectedIso: this.selectedIso,
            fonts: header?.main.fonts,
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
          //  iso: undefined,
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

    sideMenuOn(detail: ApartmentDetail | null) {
        const menuUpdate: Partial<Menu> = {...detail?.topMenu, panels: undefined, hideMenuPanelIfOne: false}
        this.store.updateMenuEffect(menuUpdate);
    }

    sideMenuOff(detail: ApartmentDetail | null) {
        const menuUpdate: Partial<Menu> = {...detail?.topMenu, panels: undefined, hideMenuPanelIfOne: true}
        this.store.updateMenuEffect(menuUpdate);
    }

    protected readonly Side = Side;
    protected readonly Layout = Layout;
}
