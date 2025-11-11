import {Component, ElementRef, Inject, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../../domain/apartment-detail";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {ApartmentDetailIso} from "../../../domain/apartment-detail-iso";
import {defaultIso} from "../../../domain/countries-iso";
import {Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar, toHTML } from "ngx-editor";
import {ContentChange, QuillModule} from 'ngx-quill'
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {IsoButtonsComponent} from '../../iso-buttons/iso-buttons.component';
import {NgFor, NgIf} from '@angular/common';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {filter, takeUntil} from "rxjs/operators";
import {ChooseIconDialogComponent} from "../choose-icon-dialog/choose-icon-dialog.component";
import {MenuIso} from "../../../domain/menu-iso";
import {PanelIso} from "../../../domain/panel-iso";
import {Layout} from "../../../domain/layout";
import {Side} from "../../../domain/side";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {Menu} from "../../../domain/menu";

@Component({
    selector: 'detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrl: './detail-dialog.component.scss',
    imports: [MatCard, MatCardHeader, IsoButtonsComponent,
        MatCardContent, FormsModule, ReactiveFormsModule, NgFor, MatLabel,
        NgxEditorMenuComponent, NgxEditorComponent, MatFormField, MatInput,
        MatError, MatIcon, TranslatePipe, MatFabButton, MatExpansionPanel,
        MatExpansionPanelHeader, MatExpansionPanelTitle, MatCheckbox, NgIf,
        QuillModule, FormsModule]
})
export class DetailDialogComponent implements OnDestroy, OnInit {

    dialog = inject(MatDialog);
    translateService = inject(TranslateService);
    fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<DetailDialogComponent>)

    form: FormGroup;
    languages: string[] | undefined = [];
    selectedIso: string = defaultIso;
    editorMap: Map<string, Editor>;
    quillConfiguration: any;
    toolbar: Toolbar = [
        ['bold', 'italic', {heading: ['h1', 'h2']}, 'underline', 'text_color'],
    ];

    isOpened: boolean = true;
    initTop: boolean = true;
    initSide: boolean = true;
    colorPresets = [""];
    unsubscribe$ = new Subject<void>();
    @ViewChild('topMenuImageInput', { static: false }) topMenuImageInput: ElementRef | undefined;
    @ViewChild('sideMenuImageInput', { static: false }) sideMenuImageInput: ElementRef | undefined;

    constructor(@Inject(MAT_DIALOG_DATA) private data: ApartmentDetailDialogData) {

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


        this.quillConfiguration = {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],                          // toggled buttons
                ['blockquote', 'code-block'],
                [{'header': 1}, {'header': 2}],                                      // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],                            // superscript/subscript
                [{'indent': '-1'}, {'indent': '+1'}],                                // outdent/indent
                [{'direction': 'rtl'}],                                              // text direction
                [{'size': ['small', false, 'large', 'huge']}],                       // custom dropdown
                [{'header': [1, 2, 3, 4, 5, 6, false]}],
                [{'color': [this.colorPresets]}, {'background': ['#e60000', '#9933ff', '#00ff00']}],
                // dropdown with defaults from theme
                [{'font': ['butcherman','electrolize','firacode', 'roboto', 'serfi', 'monospace']}],                     // whitelist of fonts
                [{'align': []}],
                ['clean'],
                ['link']                                          // link and image, video
            ]
        };

        this.form = this.fb.group({
            id: [this.data.detail.id],
            columns: [this.data.detail.columns ? this.data.detail.columns : 1],
            backgroundColor: [this.data.detail.backgroundColor ? this.data.detail.backgroundColor : ""],
            cornerRadius: [this.data.detail.cornerRadius ? this.data.detail.cornerRadius : 16],
            show: [this.data.detail.show],
            iso: this.fb.array([]),

            topMenu: this.fb.group({
                id: [this.data.detail.topMenu?.id],
                mainId: [this.data.detail.topMenu?.mainId],
                menuUrl: [this.data.detail.topMenu?.menuUrl],
                orderNum: [this.data.detail.topMenu?.id ? this.data.detail.topMenu?.orderNum : this.data.newMenuOrderNum],
                icon: [this.data.detail.topMenu?.icon],
                image: [this.data.detail.topMenu?.image],
                removeImage: [this.data.detail.topMenu?.removeImage],
                side: [this.data.detail.topMenu?.side ? this.data.detail.topMenu?.side : Side.LEFT],
                layout: [this.data.detail.topMenu?.layout ? this.data.detail.topMenu?.layout : Layout.FULL],
                iso: this.fb.array([]),
            }),

            sideMenu: this.fb.group({
                id: [this.data.detail.sideMenu?.id],
                menuId: [this.data.detail.sideMenu?.menuId],
                panelUrl: [this.data.detail.sideMenu?.panelUrl],
                image: [this.data.detail.sideMenu?.image],
                removeImage: [this.data.detail.sideMenu?.removeImage],
                orderNum: [this.data.detail.sideMenu?.id ? this.data.detail.sideMenu?.orderNum : this.newPanelOrderNum(this.data.detail)],
                icon: [this.data.detail.sideMenu?.icon],
                iso: this.fb.array([]),
            }),

//newMenuOrderNum: header.menus[header.menus.length-1].orderNum + 1
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

                    if (this.data?.detail.topMenu) {
                        this.data?.detail.topMenu.iso?.forEach(
                            iso => {
                                if (l === iso.iso) {
                                    this.addExistingMenu(iso.title, iso.description, iso.iso);
                                    dodaniMenu.push(l);
                                }
                            }
                        )
                    }

                    if ((this.data?.detail.topMenu?.side === Side.LEFT || this.data?.detail.topMenu?.side === Side.RIGHT) && this.data?.detail.sideMenu) {
                        this.data?.detail.sideMenu.iso?.forEach(
                            iso => {
                                if (l === iso.iso) {
                                    this.addExistingSideMenu(iso.title, iso.description, iso.iso);
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
                        this.addMenuPanelItem(l);
                    }
                }
            )
        } else {
            this.data?.languages?.map(iso => this.addItem(iso));
        }
        this.languages = this.data?.languages;
    }

    ngOnInit(): void {
        this.initTop = true;
        this.initSide = true;
    }

    newPanelOrderNum(detail: Partial<ApartmentDetail>) {
        if (detail && this.data.detail?.topMenu && detail.topMenu?.panels?.length) {
            return detail.topMenu.panels[detail.topMenu?.panels?.length - 1].orderNum + 1;
        } else {
            return 1;
        }
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
        (this.form.get('topMenu')?.get('iso') as FormArray).push(this.createTopMenuIso({
            title: "",
            description: "",
            iso: country
        }));
    }

    addMenuPanelItem(country: string) {
        (this.form.get('sideMenu')?.get('iso') as FormArray).push(this.createSideMenuIso({
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

    addExistingMenu(title: string, description: string, country: string) {
        (this.form.get('topMenu')?.get('iso') as FormArray).push(this.createTopMenuIso({
            title: title,
            iso: country,
            description: description
        }));
    }

    addExistingSideMenu(title: string, description: string, country: string) {
        (this.form.get('sideMenu')?.get('iso') as FormArray).push(this.createSideMenuIso({
            title: title,
            description: description,
            iso: country
        }));
    }

    createTopMenuIso(iso: MenuIso) {
        return this.fb.group({
            title: [iso.title, iso.iso === defaultIso ? [Validators.required, Validators.minLength(2), Validators.maxLength(20)] : [Validators.minLength(2), Validators.maxLength(20)]],
            description: [iso.description, [Validators.minLength(2), Validators.maxLength(100)]],
            iso: [iso.iso],
        })
    }

    createSideMenuIso(iso: PanelIso) {
        return this.fb.group({
            title: [iso.title, iso.iso === defaultIso ? [Validators.required, Validators.minLength(2), Validators.maxLength(20)] : [Validators.minLength(2), Validators.maxLength(20)]],
            description: [iso.description, [Validators.minLength(2), Validators.maxLength(100)]],
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

    get visible(){
        return this.form.value.show;
    }

    setVisible(){
        this.form.get('show')?.patchValue(
            !this.form.value.show
        );
    }

    get isNew(): boolean {
        return !this.form.value.id
    }

    get isNewPanel(): boolean {
        return !this.form.value.sideMenu.id
    }

    get isNewMenu(): boolean {
        return !this.form.value.topMenu.id
    }

    get isoArray(): FormArray {
        return this.form.get('iso') as FormArray;
    }

    isIsoSelected(iso: ApartmentDetailIso) {
        if (iso.iso === this.selectedIso) {
            return true;
        }
        return false
    }

    onCreateDetail() {
        if (this.form.valid) {

             const menuProps1 = this.form.get('topMenu')?.value as Partial<Menu>;

            console.log("this.form.value",this.selectedTopMenuImageFile);

            const detailProps = this.form.getRawValue() as Partial<ApartmentDetail>;


            console.log("menuProps1",menuProps1);
            // let menuProps2:Partial<Menu> = {
            //     ...menuProps1,
            //     image: this.selectedTopMenuImageFile,
            // } as Partial<Menu>;
            // console.log("menuProps2",menuProps2);

             const apartmentProps = {
                 ...detailProps,
                 topMenu: menuProps1,
             } as Partial<ApartmentDetail>;
             console.log("tu ima",apartmentProps);
         //   this.store.createDetailEffect(detailProps)
         this.dialogRef.close(apartmentProps);
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
        this.selectedIso = active;
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
        return this.form.value.sideMenu.icon;
    }

    get menuIcon() {
        return this.form.value.topMenu.icon;
    }

    get menuSide() {
        return this.form.value.topMenu.side;
    }

    openMenuIconDialog() {

        this.openChooseIconDialog().pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(icon => {
                if (icon === "close") {
                    icon = ""
                }
                this.form.get('topMenu')?.patchValue({
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
                this.form.get('sideMenu')?.patchValue({
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

    getTopMenuLabel(country: string | null){
        const isoList: MenuIso[] = (this.form.get('topMenu')?.get('iso') as FormArray).value;
        return isoList.find(iso => iso.iso === country)?.title;
    }

    getPageTitle(country: string | null){
        const isoList: ApartmentDetailIso[] = (this.form.get('iso') as FormArray).value;

        return  isoList.find(iso => iso.iso === country)?.title;

    }

    getTopMenuDescription(country: string | null, iso: MenuIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.description;
        } else return "";
    }

    getSideMenuLabel(country: string | null){
        const isoList: PanelIso[] = (this.form.get('sideMenu')?.get('iso') as FormArray).value;
        return isoList.find(iso => iso.iso === country)?.title;
    }

    toBigTopMenuImage: string = "";
    selectedTopMenuImage: string | null = null;
    selectedTopMenuImageFile: File | null = null;

    toBigSideMenuImage: string = "";
    selectedSideMenuImage: string | null = null;
    selectedSideMenuImageFile: File | null = null;



    get showTopMenuImage(): string | undefined {
        if (this.selectedTopMenuImage) {
            this.initTop = false;
            return this.selectedTopMenuImage;
        }else{
            if(this.initTop){
                if(this.form.get('topMenu')?.get('image')?.value){
                    return 'data:image/jpg;base64,' + this.form.get('topMenu')?.get('image')?.value;
                }else{
                    return "";
                }
            }

        }

        // if (this.selectedTopMenuImage) {
        //     return this.selectedTopMenuImage;
        // } else if (this.form.get('topMenu')?.get('image')?.value) {
        //     return 'data:image/jpg;base64,' + this.form.get('topMenu')?.get('image')?.value;
        // }
        return;
    }

    get showSideMenuImage(): string | undefined {
        if (this.selectedSideMenuImage) {
            this.initSide = false;
            return this.selectedSideMenuImage;
        }else{
            if(this.initSide){
                if(this.form.get('sideMenu')?.get('image')?.value){
                    return 'data:image/jpg;base64,' + this.form.get('sideMenu')?.get('image')?.value;
                }else{
                    return "";
                }
            }
        }
        return;
    }

    onRemoveTopMenuImage(event: any) {
        this.selectedTopMenuImage = null;
        this.form.get('topMenu')?.patchValue({
            removeImage: event.checked
        });
        if(this.topMenuImageInput){
            this.topMenuImageInput.nativeElement.value = "";
        }
    }

    onRemoveSideMenuImage(event: any) {
        this.selectedSideMenuImage = null;
        this.form.get('sideMenu')?.patchValue({
            removeImage: event.checked
        });
        if(this.sideMenuImageInput){
            this.sideMenuImageInput.nativeElement.value = "";
        }
    }

    selectTopMenuImage(event: any) {
        if (event.target.files[0].size < 589000) {
            this.selectedTopMenuImageFile = event.target.files[0];
            if (this.selectedTopMenuImageFile) {

                this.form.get('topMenu')?.patchValue({
                    image: this.selectedTopMenuImageFile
                });

                console.log("setan image", this.form.get('topMenu'));

                const reader = new FileReader();
                reader.onload = () => {
                    this.selectedTopMenuImage = reader.result as string;
                };
                reader.readAsDataURL(this.selectedTopMenuImageFile);
            }
            this.toBigTopMenuImage = "";
        } else {
            this.toBigTopMenuImage = "< 0.5 Mb";
        }
    }

    selectSideMenuImage(event: any) {
        if (event.target.files[0].size < 589000) {
            this.selectedSideMenuImageFile = event.target.files[0];
            if (this.selectedSideMenuImageFile) {

                this.form.get('sideMenu')?.patchValue({
                    image: this.selectedSideMenuImageFile
                });

                const reader = new FileReader();
                reader.onload = () => {
                    this.selectedSideMenuImage = reader.result as string;
                };
                reader.readAsDataURL(this.selectedSideMenuImageFile);
            }
            this.toBigSideMenuImage = "";
        } else {
            this.toBigSideMenuImage = "< 0.5 Mb";
        }
    }

    content: string = '';
    onContentChanged($event: ContentChange) {
        console.log('editor content changed:', $event.content);
    }

    protected readonly Layout = Layout;
    protected readonly Side = Side;
}



