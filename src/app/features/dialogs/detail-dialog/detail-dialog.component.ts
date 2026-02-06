import {Component, ElementRef, Inject, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../../domain/apartment-detail";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {defaultIso} from "../../../domain/countries-iso";
import {ContentChange, QuillModule} from 'ngx-quill'
import {TranslatePipe} from "@ngx-translate/core";
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {IsoButtonsComponent} from '../../iso-buttons/iso-buttons.component';
import {MatError} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatFabButton} from '@angular/material/button';
import {filter, takeUntil} from "rxjs/operators";
import {ChooseIconDialogComponent} from "../choose-icon-dialog/choose-icon-dialog.component";
import {MenuIso} from "../../../domain/menu-iso";
import {PanelIso} from "../../../domain/panel-iso";
import {Layout} from "../../../domain/layout";
import {Side} from "../../../domain/side";
import {MatCheckbox} from "@angular/material/checkbox";
import {Hosts} from "../../../domain/hosts";
import {MatTooltip} from "@angular/material/tooltip";
import {Language} from "../../../domain/language";
import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";
import {Cropper} from "../../../domain/cropper";
import {TopMenuType} from "../../../domain/top-menu-type";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MenuProperty} from "../../../domain/menu-property";
import {ProductType} from "../../../domain/product-type";
import {ProductProperty} from "../../../domain/product-property";
import {SafeHtmlPipe} from "../../../pipes/safe-html-pipe";

@Component({
    selector: 'detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrl: './detail-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [MatCard, MatCardHeader, IsoButtonsComponent, MatCardContent, MatExpansionPanelHeader, FormsModule, ReactiveFormsModule, MatError, MatIcon, TranslatePipe, MatFabButton, MatCheckbox, QuillModule, FormsModule, MatTooltip, ImageCropperComponent, MatExpansionPanel, MatExpansionPanelTitle, SafeHtmlPipe]
})
export class DetailDialogComponent extends Cropper implements OnDestroy, OnInit {

    dialog = inject(MatDialog);
    fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<DetailDialogComponent>)
    form: FormGroup;
    languages: Language[] | undefined = [];
    selectedIso: string = defaultIso;
    quillConfiguration: any;
    isTopSearchEnabled: boolean = false;
    isOpened: boolean = true;
    initTop: boolean = true;
    initSide: boolean = true;
    isMenu: boolean = false;
    isHotel: boolean = false;
    isResidence: boolean = false;
    isAuto: boolean = false;
    isShoppingItem: boolean = false;
    isJob: boolean = false;

    topFile: any = "";
    sideFile: any = "";

    toBigTopMenuImage: string = "";
    selectedTopMenuImage: string | null | ArrayBuffer = null;
    selectedTopMenuImageFile: File | null = null;

    toBigSideMenuImage: string = "";
    selectedSideMenuImage: string | null | ArrayBuffer = null;
    selectedSideMenuImageFile: File | null = null;

    unsubscribe$ = new Subject<void>();
    @ViewChild('topMenuImageInput', {static: false}) topMenuImageInput: ElementRef | undefined;
    @ViewChild('sideMenuImageInput', {static: false}) sideMenuImageInput: ElementRef | undefined;

    constructor(@Inject(MAT_DIALOG_DATA) private data: ApartmentDetailDialogData) {
        super();
        if (data.host === Hosts.DEMA_APARTMENTS) {
            this.isTopSearchEnabled = true;
        }

        this.selectedIso = data.selectedIso;
        const fonts = data?.fonts?.map(font => font.family);

        this.isMenu = data?.detail?.topMenu?.type == TopMenuType.MENU;
        this.isHotel = data?.detail?.topMenu?.type == TopMenuType.HOTEL;
        this.isAuto = data?.detail?.topMenu?.type == TopMenuType.AUTO;
        this.isShoppingItem = data?.detail?.topMenu?.type == TopMenuType.SHOPPING;
        this.isJob = data?.detail?.topMenu?.type == TopMenuType.JOB;
        this.isResidence = data?.detail?.topMenu?.type == TopMenuType.RESIDENCE;

        this.quillConfiguration = {
            toolbar: [
                ['bold', 'italic', {align: ''}, {align: 'center'}, {align: 'right'}, {align: 'justify'}, {
                    'color': [
                        data?.colors?.primaryColor ? data.colors.primaryColor : "",
                        data?.colors?.secondaryColor ? data.colors.secondaryColor : "",
                        data?.colors?.acceptColor ? data.colors.acceptColor : "",
                        data?.colors?.warnColor ? data.colors.warnColor : "",
                        data?.colors?.dangerColor ? data.colors.dangerColor : "",
                        data?.colors?.infoColor ? data.colors.infoColor : "",
                        "black",
                        "white"
                    ]
                }, {
                    'background': [
                        data?.colors?.primaryColor ? data.colors.primaryColor : "",
                        data?.colors?.secondaryColor ? data.colors.secondaryColor : "",
                        data?.colors?.acceptColor ? data.colors.acceptColor : "",
                        data?.colors?.warnColor ? data.colors.warnColor : "",
                        data?.colors?.dangerColor ? data.colors.dangerColor : "",
                        data?.colors?.infoColor ? data.colors.infoColor : "",
                        "black",
                        "white"
                    ]
                }],
                // ['blockquote', 'code-block'],
                //[{'header': 1}, {'header': 2}],                                      // custom button values
                // [{'list': 'ordered'}, {'list': 'bullet'}],
                // [{'script': 'sub'}, {'script': 'super'}],                            // superscript/subscript
                // [{'indent': '-1'}, {'indent': '+1'}],
                [{'size': ['1.25em', '2.3em']}],                  // custom dropdown
                // [{'header': [1, 2, 3, 4, 5, 6, false]}],
                // dropdown with defaults from theme
                [{'font': fonts}],                     // whitelist of fonts
                // [{'align': []}],
                ['clean'],
                // ['link']                                          // link and image, video
            ]
        };

        // @ts-ignore
        this.form = this.fb.group({
            id: [this.data.detail.id],
            columns: [this.data.detail.columns ? this.data.detail.columns : 1],
            backgroundColor: [this.data.detail.backgroundColor ? this.data.detail.backgroundColor : ""],
            cornerRadius: [this.data.detail.cornerRadius ? this.data.detail.cornerRadius : 16],
            show: [this.data.detail.show],
            //iso: this.fb.array([]),

            topMenu: this.fb.group({
                id: [this.data.detail.topMenu?.id],
                mainId: [this.data.detail.topMenu?.mainId],
                menuUrl: [this.data.detail.topMenu?.menuUrl],
                orderNum: [this.data.detail.topMenu?.id ? this.data.detail.topMenu?.orderNum : this.data.newMenuOrderNum],
                icon: [this.data.detail.topMenu?.icon],
                image: [this.data.detail.topMenu?.image],
                removeImage: [this.data.detail.topMenu?.removeImage],
                hideMenuPanelIfOne: [this.data.detail.topMenu?.hideMenuPanelIfOne],
                type: [this.data.detail.topMenu?.type],
                side: [this.data.detail.topMenu?.side ? this.data.detail.topMenu?.side : Side.LEFT],
                layout: [this.data.detail.topMenu?.layout ? this.data.detail.topMenu?.layout : Layout.FULL],
                iso: this.fb.array([]),
                properties: this.fb.array([]),
                productId: this.data.detail.topMenu?.productId
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

        });

        if (this.data?.detail?.topMenu?.type !== TopMenuType.MENU) {

            this.data?.products?.forEach(
                product => {
                    console.log("product", product.id + ' === ' + this.data?.detail?.topMenu?.productId);
                    if(product.id == this.data?.detail?.topMenu?.productId){
                        console.log("uso", product.id);
                        product.properties.forEach(//property=>{
                         //   this.data?.detail?.topMenu?.properties?.forEach(
                                menuProp => {
                                    console.log("puni", menuProp.name);
                                    // if(menuProp.name === property.name){
                                       // console.log("puni", menuProp.name);
                                         this.addExistingMenuProperty(menuProp?.name ? menuProp.name : "","");
                                    // }
                          //      }



                        })

                    }


                    //         if (l.iso === iso.iso) {
                    //             this.addExistingMenu(iso.title, iso.description, iso.iso);
                    //             dodaniMenu.push(l.iso);
                    //         }
                }

            )
        }

        console.log("napunjeno", this.form.get('topMenu')?.get('properties') as FormArray);

        if (this.data?.languages && this.data?.languages.length > 0) {
            const dodaniMenu: string[] = [];
            const dodaniPanel: string[] = [];
            this.data?.languages.forEach(
                l => {
                    // this.data?.detail.iso?.forEach(
                    //     iso => {
                    //         if (l === iso.iso) {
                    //             this.addExisting(iso.title, iso.iso);
                    //             dodani.push(l);
                    //         }
                    //     }
                    // )

                    if (this.data?.detail.topMenu) {
                        this.data?.detail.topMenu.iso?.forEach(
                            iso => {
                                if (l.iso === iso.iso) {
                                    this.addExistingMenu(iso.title, iso.description, iso.iso);
                                    dodaniMenu.push(l.iso);
                                }
                            }
                        )
                    }

                    if (this.isMenu || !this.isNew) {
                        if ((this.data?.detail.topMenu?.side === Side.LEFT || this.data?.detail.topMenu?.side === Side.RIGHT) && this.data?.detail.sideMenu) {
                            this.data?.detail.sideMenu.iso?.forEach(
                                iso => {
                                    if (l.iso === iso.iso) {
                                        this.addExistingSideMenu(iso.title, iso.description, iso.iso);
                                        dodaniPanel.push(l.iso);
                                    }
                                }
                            )
                        }
                    }


                }
            )
            this.data?.languages.forEach(
                l => {
                    // if (!dodani.includes(l)) {
                    //     this.addItem(l);
                    // }
                    if (!dodaniMenu.includes(l.iso)) {
                        this.addMenuItem(l.iso);
                    }

                    if (this.isMenu || !this.isNew) {
                        if (!dodaniPanel.includes(l.iso)) {
                            this.addMenuPanelItem(l.iso);
                        }
                    }

                }
            )
        } else {
            //   this.data?.languages?.map(iso => this.addItem(iso));
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

    addMenuItem(country: string) {
        (this.form.get('topMenu')?.get('iso') as FormArray).push(this.createTopMenuIso({
            title: "",
            description: "",
            iso: country
        }));
    }

    addMenuPanelItem(country: string) {
        if (this.isMenu || !this.isNew) {
            (this.form.get('sideMenu')?.get('iso') as FormArray).push(this.createSideMenuIso({
                title: "",
                description: "",
                iso: country
            }));
        }
    }

    addExistingMenu(title: string, description: string, country: string) {
        (this.form.get('topMenu')?.get('iso') as FormArray).push(this.createTopMenuIso({
            title: title,
            iso: country,
            description: description
        }));
    }

    addExistingMenuProperty(name: string, value: string) {
        (this.form.get('topMenu')?.get('properties') as FormArray).push(this.createMenuProductProperties(({
            name: name,
            value: value
        })));
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
            title: [iso.title, iso.iso === defaultIso ? [Validators.required, Validators.minLength(2), Validators.maxLength(255)] : [Validators.minLength(2), Validators.maxLength(255)]],
            description: [iso.description, [Validators.maxLength(500)]],
            iso: [iso.iso],
        })
    }


    createMenuProductProperties(property: MenuProperty) {
        return this.fb.group({
            name: [property.name, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
            value: [property.value, [Validators.maxLength(50)]],
        })
    }

    createSideMenuIso(iso: PanelIso) {
        return this.fb.group({
            title: [iso.title, iso.iso === defaultIso && (this.isMenu || !this.isNew) ? [Validators.required, Validators.minLength(2), Validators.maxLength(255)] : [Validators.maxLength(255)]],
            description: [iso.description, [Validators.maxLength(500)]],
            iso: [iso.iso],
        })
    }

    get visible() {
        return this.form.value.show;
    }

    setVisible() {
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

    get isoArray(): Language[] {
        return this.data.languages ? this.data.languages : [];
    }

    get menuProductType(): ProductType | undefined {
        return this.data.products?.find(p=>p.id == this.data.detail.topMenu?.productId);
    }

    innerUnit(property:Partial<ProductProperty> | undefined):string{
        if(property){
            return property.unit ? property.name + ' (' + property.unit + ')' : "";
        }else{
            return "";
        }
    }
    onCreateDetail() {
        if (this.form.valid) {

            // const topMenu = this.form.get('topMenu')?.value as Partial<Menu>;
            // const topMenuPayload = {
            //     ...topMenu,
            //     type: TopMenuType.MENU,
            // } as Partial<ApartmentDetail>;
            const detail = this.form.getRawValue() as Partial<ApartmentDetail>;
            //
            // const detailPayload = {
            //     ...detail,
            //     topMenu: topMenuPayload,
            // } as Partial<ApartmentDetail>;

            console.log("onCreateDetail", detail);


          this.dialogRef.close(detail);
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    activeIso(active: any) {
        this.selectedIso = active;
    }

    // remainingChars = (iso: string): number => {
    //     const list = (this.form.get('iso') as FormArray);
    //
    //     // @ts-ignore
    //     return list.controls
    //         .map(val => val.value as ApartmentDetailIso)
    //         .find(item => item.iso === iso)?.title.length;
    // };

    // remainingSize(iso: string) {
    //     return this.translateService.instant('detail.dialog.remaining.size', {length: this.remainingChars(iso)});
    // }

    get sideMenuIcon() {
        return this.form.value.sideMenu.icon;
    }

    get topMenuIcon() {
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

    openSideMenuIconDialog() {
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
            width: '25rem',
        });
        return dialogRef.afterClosed();
    }

    getSideMenuLabel(country: string | null) {
        const isoList: PanelIso[] = (this.form.get('sideMenu')?.get('iso') as FormArray).value;
        const description: string | undefined = this.getSideMenuDescription(country);
        const title: string | undefined = isoList.find(iso => iso.iso === country)?.title;
        let output: string = "";
        if (title) {
            output = output + title;
        }
        if (description) {
            output = output + description;
        }
        return output;
    }

    getTopMenuLabel(country: string | null) {
        const isoList: MenuIso[] = (this.form.get('topMenu')?.get('iso') as FormArray).value;
        const description: string | undefined = this.getTopMenuDescription(country);
        const title: string | undefined = isoList.find(iso => iso.iso === country)?.title;
        let output: string = "";
        if (title) {
            output = output + title;
        }
        if (description) {
            output = output + description;
        }
        return output;
    }

    getTopMenuDescription(country: string | null) {
        const isoList: MenuIso[] = (this.form.get('topMenu')?.get('iso') as FormArray).value;
        return isoList.find(iso => iso.iso === country)?.description;
    }

    getSideMenuDescription(country: string | null) {
        const isoList: PanelIso[] = (this.form.get('sideMenu')?.get('iso') as FormArray).value;
        return isoList.find(iso => iso.iso === country)?.description;
    }

    get showTopMenuImage(): string | undefined | ArrayBuffer {
        if (this.selectedTopMenuImage) {
            this.initTop = false;
            return this.selectedTopMenuImage;
        } else {
            if (this.initTop) {
                if (this.form.get('topMenu')?.get('image')?.value) {
                    return 'data:image/jpg;base64,' + this.form.get('topMenu')?.get('image')?.value;
                } else {
                    return "";
                }
            }
        }
        return;
    }

    get showSideMenuImage(): string | undefined | ArrayBuffer {
        if (this.selectedSideMenuImage) {
            this.initSide = false;
            return this.selectedSideMenuImage;
        } else {
            if (this.initSide) {
                if (this.form.get('sideMenu')?.get('image')?.value) {
                    return 'data:image/jpg;base64,' + this.form.get('sideMenu')?.get('image')?.value;
                } else {
                    return "";
                }
            }
        }
        return;
    }

    onRemoveTopMenuImage(event: any) {
        this.selectedTopMenuImage = null;
        this.topFile = {};
        this.form.get('topMenu')?.patchValue({
            removeImage: event.checked
        });
        if (this.topMenuImageInput) {
            this.topMenuImageInput.nativeElement.value = "";
        }
    }

    onRemoveSideMenuImage(event: any) {
        this.selectedSideMenuImage = null;
        this.sideFile = {};
        this.form.get('sideMenu')?.patchValue({
            removeImage: event.checked
        });
        if (this.sideMenuImageInput) {
            this.sideMenuImageInput.nativeElement.value = "";
        }
    }

    selectTopMenuImage(event: any) {
        if (event.target.files[0]?.size < 589000) {
            this.selectedTopMenuImageFile = event.target.files[0];
            if (this.selectedTopMenuImageFile) {
                this.topFile = {};
                this.form.get('topMenu')?.patchValue({
                    image: this.selectedTopMenuImageFile
                });
                const reader = new FileReader();
                reader.onload = () => {
                    this.selectedTopMenuImage = reader.result as string;
                };
                reader.readAsDataURL(this.selectedTopMenuImageFile);
            }
            this.toBigTopMenuImage = "";
        } else {
            const file = event.target.files[0];
            const ext = this.getFilenameExtension(file);
            const type = file.type;
            this.topFile = {
                ext: ext,
                file: file,
                type: type,
            };
        }
    }

    selectSideMenuImage(event: any) {
        if (event.target.files[0]?.size < 589000) {
            this.selectedSideMenuImageFile = event.target.files[0];
            if (this.selectedSideMenuImageFile) {
                this.sideFile = {};
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
            //optimizied it

            const file = event.target.files[0];
            const ext = this.getFilenameExtension(file);
            const type = file.type;
            this.sideFile = {
                ext: ext,
                file: file,
                type: type,
            };
        }
    }


    topImageCropped(event: ImageCroppedEvent) {
        if (event.objectUrl) {
            fetch(event.objectUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        this.selectedTopMenuImage = reader.result;
                    };
                    reader.readAsDataURL(blob);

                    if (blob.size > 300000) {
                        this.toBigTopMenuImage = "Image to big. < 0.3Mb";
                    } else {
                        this.form.get('topMenu')?.patchValue({
                            image: blob
                        });
                    }
                });
        }
    }

    sideImageCropped(event: ImageCroppedEvent) {
        if (event.objectUrl) {
            fetch(event.objectUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        this.selectedSideMenuImage = reader.result;
                        //  console.log("onloadend",reader.result);
                    };
                    reader.readAsDataURL(blob);

                    if (blob.size > 300000) {
                        this.toBigSideMenuImage = "Image to big. < 0.3Mb";
                    } else {
                        this.form.get('sideMenu')?.patchValue({
                            image: blob
                        });
                    }
                });
        }
    }

    onContentChangedTopTitle($event: ContentChange) {
        const url = $event.text.toLowerCase().replaceAll(" ", "_").replaceAll("\n", "");
        if (this.selectedIso === defaultIso) {
            this.form.get('topMenu')?.patchValue({
                menuUrl: url
            });
        }
    }

    onContentChangedSideTitle($event: ContentChange) {
        const url = $event.text.toLowerCase().replaceAll(" ", "_").replaceAll("\n", "");
        if (this.selectedIso === defaultIso) {
            this.form.get('sideMenu')?.patchValue({
                panelUrl: url
            });
        }
    }

    isIsoSelected(iso: string) {

        if (iso === this.selectedIso) {
            return true;
        }
        return false
    }

    protected readonly Layout = Layout;
    protected readonly Side = Side;
    protected readonly Hosts = Hosts;
    protected readonly Object = Object;
}



