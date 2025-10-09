import {Component, Inject, inject, OnDestroy} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../../domain/apartment-detail";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {ApartmentDetailIso} from "../../../domain/apartment-detail-iso";
import {defaultIso} from "../../../domain/countries-iso";
import {Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar} from "ngx-editor";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {IsoButtonsComponent} from '../../iso-buttons/iso-buttons.component';
import {NgFor} from '@angular/common';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatFabButton} from '@angular/material/button';
import {filter, takeUntil} from "rxjs/operators";
import {ChooseIconDialogComponent} from "../choose-icon-dialog/choose-icon-dialog.component";
import {MenuIso} from "../../../domain/menu-iso";
import {PanelIso} from "../../../domain/panel-iso";
import {Layout} from "../../../domain/layout";
import {Side} from "../../../domain/side";

@Component({
    selector: 'detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrl: './detail-dialog.component.scss',
    imports: [MatCard, MatCardHeader, IsoButtonsComponent, MatCardContent, FormsModule, ReactiveFormsModule, NgFor, MatLabel, NgxEditorMenuComponent, NgxEditorComponent, MatFormField, MatInput, MatError, MatIcon, MatButton, TranslatePipe, MatFabButton]
})
export class DetailDialogComponent implements OnDestroy {

    dialog = inject(MatDialog);
    translateService = inject(TranslateService);
    fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<DetailDialogComponent>)

    form: FormGroup;
    languages: string[] | undefined = [];
    selectedIsoTitle: string = defaultIso;
    editorMap: Map<string, Editor>;
    toolbar: Toolbar = [
        ['bold', 'italic', {heading: ['h1', 'h2']}, 'underline', 'text_color'],
    ];

    colorPresets = [""];
    unsubscribe$ = new Subject<void>();

    constructor(@Inject(MAT_DIALOG_DATA) private data: ApartmentDetailDialogData) {
        console.log("detail dialog incoming data", data);

        this.colorPresets = [
            data?.colors?.primaryColor ? data.colors.primaryColor : "",
            data?.colors?.secondaryColor ? data.colors.secondaryColor : "",
            data?.colors?.acceptColor ? data.colors.acceptColor : "",
            data?.colors?.warnColor ? data.colors.warnColor : "",
            data?.colors?.dangerColor ? data.colors.dangerColor : "",
            data?.colors?.infoColor ? data.colors.infoColor : "",
            "black",
            "white"
        ]
        this.editorMap = new Map<string, Editor>();

        this.form = this.fb.group({
            id: [this.data.detail.id],
            columns: [this.data.detail.columns ? this.data.detail.columns : 1],
            cornerRadius: [this.data.detail.cornerRadius ? this.data.detail.cornerRadius : 16],
            show: [this.data.detail.show],
            iso: this.fb.array([]),

            menu: this.fb.group({
                id: [this.data.detail.menu?.id],
                mainId: [this.data.detail.menu?.mainId],
                menuUrl: [this.data.detail.menu?.menuUrl],
                orderNum: [this.data.detail.menu?.orderNum],
                icon: [this.data.detail.menu?.icon],
                side: [this.data.detail.menu?.side ? this.data.detail.menu?.side : Side.LEFT],
                layout: [this.data.detail.menu?.layout ? this.data.detail.menu?.layout : Layout.FULL],
                iso: this.fb.array([]),
            }),

            panel: this.fb.group({
                id: [this.data.detail.panel?.id],
                menuId: [this.data.detail.panel?.menuId],
                panelUrl: [this.data.detail.panel?.panelUrl],
                icon: [this.data.detail.panel?.icon],
                iso: this.fb.array([]),
            }),


        });


        if (this.data?.languages && this.data?.languages.length > 0) {
            const dodani: string[] = [];
            const dodaniMenu: string[] = [];
            const dodaniPanel: string[] = [];
            this.data?.languages.forEach(
                l => {


                    this.data?.detail.iso?.forEach(
                        iso => {
                            if (l === iso.iso) {
                                this.addExisting(iso.title, iso.iso);
                                dodani.push(l);
                            }
                        }
                    )

                    if (this.data?.detail.menu) {
                        this.data?.detail.menu.iso?.forEach(
                            iso => {
                                if (l === iso.iso) {
                                    this.addExistingMenu(iso.title, iso.iso);
                                    dodaniMenu.push(l);
                                }
                            }
                        )
                    }

                    if ((this.data?.detail.menu?.side === Side.LEFT || this.data?.detail.menu?.side === Side.RIGHT) && this.data?.detail.panel) {
                        this.data?.detail.panel.iso?.forEach(
                            iso => {
                                if (l === iso.iso) {
                                    this.addExistingMenuPanel(iso.title, iso.description, iso.iso);
                                    dodaniPanel.push(l);
                                }
                            }
                        )
                    }
                }
            )
            this.data?.languages.forEach(
                l => {
                    if (!dodani.includes(l)) {
                        this.addItem(l);
                    }
                    if (!dodaniMenu.includes(l)) {
                        this.addMenuItem(l);
                    }

                    if (!dodaniPanel.includes(l)) {
                        if(this.data?.detail.menu?.side === Side.LEFT || this.data?.detail.menu?.side === Side.RIGHT){
                            this.addMenuPanelItem(l);
                        }
                    }
                }
            )

        } else {
            this.data?.languages?.map(iso => this.addItem(iso));
        }

        this.languages = this.data?.languages;
    }

    editor = (iso: string): Editor => {
        const editor = this.editorMap.get(iso);
        if (editor) {
            return editor;
        }
        return new Editor();
    };

    addItem(country: string) {
        (this.form.get('iso') as FormArray).push(this.createApartmentDetailIso({title: "", iso: country}));
    }

    addMenuItem(country: string) {
        (this.form.get('menu')?.get('iso') as FormArray).push(this.createApartmentDetailMenuIso({
            title: "",
            iso: country
        }));
    }

    addMenuPanelItem(country: string) {
        (this.form.get('panel')?.get('iso') as FormArray).push(this.createApartmentDetailMenuPanelIso({
            title: "",
            description: "",
            iso: country
        }));
    }

    addExisting(title: string, country: string) {
        (this.form.get('iso') as FormArray).push(this.createApartmentDetailIso({
            title: title,
            iso: country
        }));
    }

    addExistingMenu(title: string, country: string) {
        (this.form.get('menu')?.get('iso') as FormArray).push(this.createApartmentDetailMenuIso({
            title: title,
            iso: country
        }));
    }

    addExistingMenuPanel(title: string, description: string, country: string) {
        (this.form.get('panel')?.get('iso') as FormArray).push(this.createApartmentDetailMenuPanelIso({
            title: title,
            description: description,
            iso: country
        }));
    }

    createApartmentDetailMenuIso(iso: MenuIso) {
        return this.fb.group({
            title: [iso.title, iso.iso === defaultIso ? [Validators.required, Validators.minLength(2), Validators.maxLength(10)] : [Validators.minLength(2), Validators.maxLength(10)]],
            iso: [iso.iso],
        })
    }

    createApartmentDetailMenuPanelIso(iso: PanelIso) {
        return this.fb.group({
            title: [iso.title, iso.iso === defaultIso ? [Validators.required, Validators.minLength(2), Validators.maxLength(10)] : [Validators.minLength(2), Validators.maxLength(10)]],
            description: [iso.description, [Validators.minLength(2), Validators.maxLength(50)]],
            iso: [iso.iso],
        })
    }

    createApartmentDetailIso(iso: ApartmentDetailIso) {
        this.editorMap.set(iso.iso, new Editor());
        return this.fb.group({
            title: [iso.title, [Validators.minLength(2), Validators.maxLength(150)]],
            iso: [iso.iso],
        })
    }

    get isNew(): boolean {
        return !this.form.value.id
    }

    get isNewPanel(): boolean {
        return !this.form.value.panel.id
    }

    get isNewMenu(): boolean {
        return !this.form.value.menu.id
    }

    isOn = true;

    get isoArray(): FormArray {
        // console.log('getting the test array', this.form.get('iso'));
        return this.form.get('iso') as FormArray;
    }

    isIsoSelected(iso: ApartmentDetailIso) {
        if (iso.iso === this.selectedIsoTitle) {
            return true;
        }
        return false
    }

    // closeDialog() {
    //     this.dialogRef.close();
    // }

    onCreateDetail() {
        if (this.form.valid) {
            const detailProps = this.form.getRawValue() as Partial<ApartmentDetail>;
            console.log("onCreateDetail valid form", detailProps);
            this.dialogRef.close(detailProps);
        }
    }

    ngOnDestroy() {
        this.editorMap.forEach((editor: Editor, key: string) => {
            editor.destroy();
        });
        this.editorMap.clear();

        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    activeIso(active: any) {
        this.selectedIsoTitle = active;
    }

    remainingChars = (iso: string): number => {
        const list = (this.form.get('iso') as FormArray);

        // @ts-ignore
        return list.controls
            .map(val => val.value as ApartmentDetailIso)
            .find(item => item.iso === iso)?.title.length;
    };

    remainingSize(iso: string) {
        return this.translateService.instant('detail.dialog.remaining.size', {length: this.remainingChars(iso)});
    }

    get panelIcon() {
        return this.form.value.panel.icon;
    }

    get menuIcon() {
        return this.form.value.menu.icon;
    }

    get menuSide() {
        return this.form.value.menu.side;
    }
    openMenuIconDialog() {

        this.openChooseIconDialog().pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(icon => {
                if (icon === "close") {
                    icon = ""
                }
                this.form.get('menu')?.patchValue({
                    icon: icon
                })
            }
        );
    }

    openPanelIconDialog() {

        this.openChooseIconDialog().pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(icon => {
                if (icon === "close") {
                    icon = ""
                }
                this.form.get('panel')?.patchValue({
                    icon: icon
                })
            }
        );
    }

    openChooseIconDialog() {
        const dialogRef = this.dialog.open(ChooseIconDialogComponent, {
            width: '400px',
        });
        return dialogRef.afterClosed();
    }

    protected readonly Layout = Layout;
    protected readonly Side = Side;
}



