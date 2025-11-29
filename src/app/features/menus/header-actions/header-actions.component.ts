import {
    Component,
    ElementRef,
    inject,
    Input,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatError, MatLabel} from "@angular/material/form-field";
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import {Header} from "../../../domain/header";
import {Apartment} from "../../../domain/apartment";
import {ApartmentStore} from "../../../services/apartments-store.service";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {TranslatePipe} from "@ngx-translate/core";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import {QuillEditorComponent} from "ngx-quill";
import {defaultIso, getIsoByKey} from "../../../domain/countries-iso";
import {ApartmentIso} from "../../../domain/apartment-iso";
import {NgClass} from "@angular/common";
import {MatDivider} from "@angular/material/divider";
import {MatFabButton} from "@angular/material/button";
import {font_families} from "../../../domain/font";
import {ChooseIsoComponent} from "../../choose-iso/choose-iso.component";
import {Language} from "../../../domain/language";

@Component({
    selector: 'header-actions',
    imports: [
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatLabel,
        FormsModule,
        ReactiveFormsModule,
        MatError,
        MatCheckbox,
        TranslatePipe,
        MatSlider,
        MatSliderThumb,
        QuillEditorComponent,
        NgClass,
        MatDivider,
        MatFabButton,
        ChooseIsoComponent,
    ],
    templateUrl: './header-actions.component.html',
    styleUrl: './header-actions.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class HeaderActionsComponent implements OnInit {

    fb = inject(FormBuilder);
    store = inject(ApartmentStore);

    @Input() header: Header | null = null;

    @ViewChildren('editor') editors: QueryList<QuillEditorComponent> | undefined;

    quillConfiguration: any;

    isOpened: boolean = true;
    form: FormGroup;
    selectedPicture: string | null = null;
    selectedPictureBackground: string | null = null;
    toBigImage: string = "";
    toBigBackgroundImage: string = "";
    selectedLogo: File | null = null;
    selectedBackgroundImage: File | null = null;

    selectedIso: string = defaultIso;
    selectedFamilies: string[] | undefined = [];

    constructor() {

        this.form = this.fb.group({
            primaryColor: [this.header?.main?.primaryColor ? this.header?.main?.primaryColor : "", Validators.required],
            secondaryColor: [this.header?.main?.secondaryColor, Validators.required],
            dangerColor: [this.header?.main?.dangerColor],
            warnColor: [this.header?.main?.warnColor],
            infoColor: [this.header?.main?.infoColor],
            acceptColor: [this.header?.main?.acceptColor],
            iconImage: [this.header?.main.iconImage],
            backgroundImage: [this.header?.main.backgroundImage],
            iso: this.fb.array([]),
        });

    }

    ngOnInit() {
        this.form.patchValue({primaryColor: this.header?.main?.primaryColor ? this.header?.main?.primaryColor : ""});
        this.form.patchValue({secondaryColor: this.header?.main?.secondaryColor ? this.header?.main?.secondaryColor : ""});
        this.form.patchValue({dangerColor: this.header?.main?.dangerColor ? this.header?.main?.dangerColor : ""});
        this.form.patchValue({warnColor: this.header?.main?.warnColor ? this.header?.main?.warnColor : ""});
        this.form.patchValue({infoColor: this.header?.main?.infoColor ? this.header?.main?.infoColor : ""});
        this.form.patchValue({acceptColor: this.header?.main?.acceptColor ? this.header?.main?.acceptColor : ""});
        this.form.patchValue({iconImage: this.header?.main?.iconImage});
        this.form.patchValue({backgroundImage: this.header?.main?.backgroundImage});
        this.form.patchValue({interests: this.header?.main?.backgroundImage});

        if (this.header && this.header?.main.iso?.length > 0) {
            this.header?.main.iso.map(iso => this.addExisting(iso.title, iso.description, iso.iconText, iso.iso));
        } else {
             this.header?.main.languages.map(iso => this.addItem(iso.iso));
        }
        this.selectedFamilies = this.header?.main?.fonts.map(font => font.family);


        const fonts = this.header?.main?.fonts?.map(font=>font.family);
        this.quillConfiguration = {
            toolbar: [
                ['bold', 'italic',{align: ''}, {align: 'center'}, {align: 'right'}, {align: 'justify'},{
                    'color': [
                        this.header?.main?.colors?.primaryColor ? this.header.main.primaryColor : "",
                        this.header?.main?.colors?.secondaryColor ? this.header.main.secondaryColor : "",
                        this.header?.main?.colors?.acceptColor ? this.header.main.acceptColor : "",
                        this.header?.main?.colors?.warnColor ? this.header.main.warnColor : "",
                        this.header?.main?.colors?.dangerColor ? this.header.main.dangerColor : "",
                        this.header?.main?.colors?.infoColor ? this.header.main.infoColor : "",
                        "black",
                        "white"
                    ]
                }, {
                    'background': [
                        this.header?.main?.colors?.primaryColor ? this.header.main.colors?.primaryColor : "",
                        this.header?.main?.colors?.secondaryColor ? this.header.main.colors?.secondaryColor : "",
                        this.header?.main?.colors?.acceptColor ? this.header.main.colors?.acceptColor : "",
                        this.header?.main?.colors?.warnColor ? this.header.main.colors?.warnColor : "",
                        this.header?.main?.colors?.dangerColor ? this.header.main.colors?.dangerColor : "",
                        this.header?.main?.colors?.infoColor ? this.header.main.colors?.infoColor : "",
                        "black",
                        "white"
                    ]
                }],
                // ['blockquote', 'code-block'],
                //[{'header': 1}, {'header': 2}],                                      // custom button values
                // [{'list': 'ordered'}, {'list': 'bullet'}],
                // [{'script': 'sub'}, {'script': 'super'}],                            // superscript/subscript
                // [{'indent': '-1'}, {'indent': '+1'}],
                [{'size': ['small', false, 'large', 'huge']}],                       // custom dropdown
                // [{'header': [1, 2, 3, 4, 5, 6, false]}],
                // dropdown with defaults from theme
                [{'font': fonts}],                     // whitelist of fonts
                // [{'align': []}],
                // ['clean'],
                // ['link']                                          // link and image, video
            ]
        };
    }

    addItem(country: string) {
        (this.form.get('iso') as FormArray).push(this.createMainIso({
            title: "",
            description: "",
            iconText: "",
            iso: country
        }));
    }


    flag(country: string) {
        return "fi fi-" + country.toLowerCase();
    }

    createMainIso(iso: ApartmentIso) {
        return this.fb.group({
            description: [iso.description, [Validators.maxLength(500)]],
            title: [iso.title, [Validators.minLength(3), Validators.maxLength(255)]],
            iso: [iso.iso],
            iconText: [iso.iconText, [Validators.minLength(3), Validators.maxLength(255)]],
        })
    }

    get primaryColor() {
        return this.header?.main?.primaryColor ? this.header?.main.primaryColor : "";
    };

    get secondaryColor() {
        return this.header?.main?.secondaryColor ? this.header?.main.secondaryColor : ""
    };

    get dangerColor() {
        return this.header?.main?.dangerColor ? this.header?.main.dangerColor : "";
    };

    get warnColor() {
        return this.header?.main?.warnColor ? this.header?.main.warnColor : "";
    };

    get infoColor() {
        return this.header?.main?.infoColor ? this.header?.main.infoColor : "";
    };

    get acceptColor() {
        return this.header?.main?.acceptColor ? this.header?.main.acceptColor : "";
    };

    reload(){
     window.location.reload();
    }

    formatLabel(value: number): string {
        return `${value}`;
    }

    changeSlider(event: any) {
        const apartmentProps = {
            ...this.header?.main,
            linearPercentage: event,
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);
    }

    changeTitleAndDescription(event: any) {
        // const apartmentProps = {
        //     ...this.header?.main,
        //     linearPercentage: event,
        // } as Partial<Apartment>;
        // this.store.createMainEffect(apartmentProps);
    }

    get rate() {
        return this.header?.main?.linearPercentage ? this.header.main.linearPercentage : 0
    }

    changeColor() {
      //  if (this.form.valid) {
            const apartmentProps = {
                ...this.header?.main,
                primaryColor: this.form.value.primaryColor,
                secondaryColor: this.form.value.secondaryColor,
                dangerColor: this.form.value.dangerColor,
                warnColor: this.form.value.warnColor,
                infoColor: this.form.value.infoColor,
                acceptColor: this.form.value.acceptColor,
            } as Partial<Apartment>;
            this.store.createMainEffect(apartmentProps);
      //  }
    }

    get showPicture(): string | undefined {
        if (this.selectedPicture) {
            return this.selectedPicture;
        } else if (this.header?.main.iconImage) {
            return 'data:image/jpg;base64,' + this.header?.main.iconImage;
        }
        return;
    }

    get showBackgroundImage(): string | undefined {
        if (this.selectedPictureBackground) {
            return this.selectedPictureBackground;
        } else if (this.header?.main.backgroundImage) {
            return 'data:image/jpg;base64,' + this.header?.main.backgroundImage
        }
        return;
    }


    selectLogo(event: any) {
        if (event.target.files[0].size < 589000) {
            this.selectedLogo = event.target.files[0];
            if (this.selectedLogo) {

                const apartmentProps = {
                    ...this.header?.main,
                    iconImage: this.selectedLogo,
                } as Partial<Apartment>;
                this.store.createMainEffect(apartmentProps);

                const reader = new FileReader();
                reader.onload = () => {
                    this.selectedPicture = reader.result as string;
                };
                reader.readAsDataURL(this.selectedLogo);
            }
            this.toBigImage = "";
        } else {
            this.toBigImage = "< 0.5 Mb";
        }
    }

    selectBackgroundImage(event: any) {

        if (event.target.files[0].size < 589000) {
            this.selectedBackgroundImage = event.target.files[0];
            if (this.selectedBackgroundImage) {
                const apartmentProps = {
                    ...this.header?.main,
                    backgroundImage: this.selectedBackgroundImage,
                } as Partial<Apartment>;
                this.store.createMainEffect(apartmentProps);
                const reader = new FileReader();
                reader.onload = () => {
                    this.selectedPictureBackground = reader.result as string;
                };
                reader.readAsDataURL(this.selectedBackgroundImage);
            }
            this.toBigBackgroundImage = "";
        } else {
            this.toBigBackgroundImage = "< 0.5 Mb";
        }
    }

    @ViewChild('logoImageInput', {static: false}) logoImageInput: ElementRef | undefined;
    @ViewChild('backgroundImageInput', {static: false}) backgroundImageInput: ElementRef | undefined;

    onRemovePicture(event: any) {
        this.selectedPicture = null;
        if (this.logoImageInput) {
            this.logoImageInput.nativeElement.value = "";
        }
        const apartmentProps = {
            ...this.header?.main,
            removePicture: event.checked,
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);
    }

    onRemoveBackgroundPicture(event: any) {
        this.selectedPictureBackground = null;
        if (this.backgroundImageInput) {
            this.backgroundImageInput.nativeElement.value = "";
        }
        const apartmentProps = {
            ...this.header?.main,
            removePictureBackground: event.checked,
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);
    }

    onUpdateIso() {
        const isoProps = this.form.value.iso as Partial<ApartmentIso>;
        const mainProps = {
            ...this.header?.main,
            iso: isoProps,
        } as Partial<Apartment>;
        this.store.createMainEffect(mainProps);
    }

    addExisting(title: string, description: string, iconText: string, country: string) {
        (this.form.get('iso') as FormArray).push(this.createMainIso({
            title: title,
            description: description,
            iconText: iconText,
            iso: country
        }));
    }

    onChange(selectedOption: MatCheckboxChange) {
        if (this.selectedFamilies) {
            if (selectedOption.checked) {
                this.selectedFamilies.push(selectedOption.source.value);
            } else {
                this.selectedFamilies = this.selectedFamilies.filter(font => font !== selectedOption.source.value);
            }
        }

        const apartmentProps = {
            ...this.header?.main,
            fonts: this.selectedFamilies,
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);
    }

    onSelectedIso(selected:string[]){
        console.log(selected);

        const apartmentProps = {
            ...this.header?.main,
            languages: selected.map((iso) => {
                return { iso: iso } as Language;
            }),
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);
    }


    getChecked(family: string) {
        if (this.selectedFamilies) {
            return this.selectedFamilies.includes(family);
        } else {
            return false;
        }
    }

    protected readonly getIsoByKey = getIsoByKey;
    protected readonly font_families = font_families;
}
