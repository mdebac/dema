import {Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatError, MatLabel} from "@angular/material/form-field";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Header} from "../../../domain/header";
import {Apartment} from "../../../domain/apartment";
import {ApartmentStore} from "../../../services/apartments-store.service";
import {MatIcon} from "@angular/material/icon";
import {MatCheckbox} from "@angular/material/checkbox";
import {TranslatePipe} from "@ngx-translate/core";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";

@Component({
    selector: 'header-actions',
    imports: [
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        MatLabel,
        FormsModule,
        ReactiveFormsModule,
        MatIcon,
        MatError,
        MatCheckbox,
        TranslatePipe,
        MatSlider,
        MatSliderThumb,
    ],
    templateUrl: './header-actions.component.html',
    styleUrl: './header-actions.component.scss'
})
export class HeaderActionsComponent implements OnInit {

    fb = inject(FormBuilder);
    store = inject(ApartmentStore);

    @Input() header: Header | null = null;

    isOpened: boolean = true;
    form: FormGroup;
    selectedPicture: string | null = null;
    selectedPictureBackground: string | null = null;
    toBigImage: string = "";
    toBigBackgroundImage: string = "";
    selectedLogo: File | null = null;
    selectedBackgroundImage: File | null = null;

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


    formatLabel(value: number): string {
        return `${value}`;
    }

    changeSlider(event: any){
       // this.form.patchValue({linearPercentage: event})

        const apartmentProps = {
            ...this.header?.main,
            linearPercentage: event,
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);


    }

    get rate(){
        return this.header?.main?.linearPercentage ? this.header.main.linearPercentage : 0
    }

    changeColor() {
        if (this.form.valid) {
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
        }
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

    @ViewChild('logoImageInput', { static: false }) logoImageInput: ElementRef | undefined;
    @ViewChild('backgroundImageInput', { static: false }) backgroundImageInput: ElementRef | undefined;
    onRemovePicture(event: any) {
        this.selectedPicture = null;
        if(this.logoImageInput){
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
        if(this.backgroundImageInput){
            this.backgroundImageInput.nativeElement.value = "";
        }
        const apartmentProps = {
            ...this.header?.main,
            removePictureBackground: event.checked,
        } as Partial<Apartment>;
        this.store.createMainEffect(apartmentProps);
    }
}
