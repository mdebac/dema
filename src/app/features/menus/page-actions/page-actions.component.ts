import {Component, HostBinding, inject, Input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
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
import {Apartment} from "../../../domain/apartment";
import {ApartmentDialogComponent} from "../../dialogs/apartment-dialog/apartment-dialog.component";
import {
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatCheckbox} from "@angular/material/checkbox";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatError} from "@angular/material/form-field";

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
        MatCheckbox,
        MatError,
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

    @HostBinding("style.--direction")
    @Input() direction: string = "";

    unsubscribe$ = new Subject<void>();

    isOpened: boolean = true;
    form: FormGroup;

    selectedPictureTopMenu: string | null = null;
    toBigTopMenuImage: string = "";
    selectedTopMenuImage: File | null = null;

    selectedPictureSideMenu: string | null = null;
    toBigSideMenuImage: string = "";
    selectedSideMenuImage: File | null = null;

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


    updateTitlesAndIcons(header: Header | null, detail: ApartmentDetail | null) {

       if(this.updateTitlesAndIconsPanel){
           this.updateTitlesAndIconsPanel.toggle();
       }

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
                    this.store.updateDetailEffect(detailProps);
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
            iso: undefined,
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

    // changeHeader(main: Apartment | undefined) {
    //     console.log("changeHeader dialog enter", main);
    //     this.openApartmentDialog(main).pipe(
    //         filter(val => !!val),
    //         takeUntil(this.unsubscribe$)
    //     ).subscribe(detailProps => {
    //             console.log("changeHeader dialog finish", detailProps);
    //             this.store.createMainEffect(detailProps);
    //         }
    //     );
    // }

    get showTopMenuImage(): string | undefined {
        if (this.selectedPictureTopMenu) {
            return this.selectedPictureTopMenu;
        } else if (this.activeDetail?.topMenu?.image) {
            return 'data:image/jpg;base64,' + this.activeDetail?.topMenu?.image
        }
        return;
    }

    get showSideMenuImage(): string | undefined {
        if (this.selectedPictureSideMenu) {
            return this.selectedPictureSideMenu;
        } else if (this.activeDetail?.sideMenu?.image) {
            return 'data:image/jpg;base64,' + this.activeDetail?.sideMenu?.image
        }
        return;
    }

    selectTopMenuImage(event: any) {
        if (event.target.files[0].size < 589000) {
            this.selectedTopMenuImage = event.target.files[0];
            if (this.selectedTopMenuImage) {
                const apartmentProps = {
                    ...this.header?.main,
                    topMenuImage: this.selectedTopMenuImage,
                } as Partial<Apartment>;
                this.store.createMainEffect(apartmentProps);
                const reader = new FileReader();
                reader.onload = () => {
                    this.selectedPictureTopMenu = reader.result as string;
                };
                reader.readAsDataURL(this.selectedTopMenuImage);
            }
            this.toBigTopMenuImage = "";
        } else {
            this.toBigTopMenuImage = "< 0.5 Mb";
        }
    }

    selectSideMenuImage(event: any) {
        if (event.target.files[0].size < 589000) {
            this.selectedSideMenuImage = event.target.files[0];
            if (this.selectedSideMenuImage) {
                const apartmentProps = {
                    ...this.header?.main,
                    sideMenuImage: this.selectedSideMenuImage,
                } as Partial<Apartment>;
                this.store.createMainEffect(apartmentProps);
                const reader = new FileReader();
                reader.onload = () => {
                    this.selectedPictureSideMenu = reader.result as string;
                };
                reader.readAsDataURL(this.selectedSideMenuImage);
            }
            this.toBigSideMenuImage = "";
        } else {
            this.toBigSideMenuImage = "< 0.5 Mb";
        }
    }

    onRemoveSideMenuPicture(event: any) {
        this.selectedPictureSideMenu = null;
        const apartmentProps = {
            ...this.header?.main,
            removePictureSideMenu: event.checked,
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);
    }

    onRemoveTopMenuPicture(event: any) {
        this.selectedPictureTopMenu = null;
        const apartmentProps = {
            ...this.header?.main,
            removePictureTopMenu: event.checked,
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);
    }

    protected readonly Side = Side;
    protected readonly Layout = Layout;
}
