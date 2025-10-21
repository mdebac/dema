import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule
} from "@angular/forms";
import {Apartment} from "../../../domain/apartment";
import {Subject} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ApartmentIso} from "../../../domain/apartment-iso";
import {filter, takeUntil} from "rxjs/operators";
import {ChooseIsoDialogComponent} from "../choose-iso-dialog/choose-iso-dialog.component";
import {defaultIso} from "../../../domain/countries-iso";
import {MatCard, MatCardHeader, MatCardContent} from '@angular/material/card';
import {IsoButtonsComponent} from '../../iso-buttons/iso-buttons.component';
import {MatIconButton, MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgFor} from '@angular/common';
import {MatFormField, MatLabel, MatError, MatHint} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {ColorPickerDirective} from 'ngx-color-picker';
import {
    MatExpansionModule,
} from "@angular/material/expansion";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDivider} from "@angular/material/divider";
import {MatCheckbox} from "@angular/material/checkbox";
import {AuthStore} from "../../../services/authentication/auth-store";
import {Roles} from "../../../domain/roles";
import {Hosts} from "../../../domain/hosts";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";
import clone from 'lodash/cloneDeep';
import merge from 'lodash/merge';

@Component({
    selector: 'apartment-dialog',
    templateUrl: './apartment-dialog.component.html',
    styleUrl: './apartment-dialog.component.scss',
    imports: [MatCheckbox,
        MatDivider,
        MatExpansionModule,
        MatCard,
        MatCardHeader,
        IsoButtonsComponent,
        MatIconButton,
        MatIcon,
        MatCardContent,
        FormsModule,
        ReactiveFormsModule,
        NgFor, MatFormField,
        MatLabel,
        MatInput,
        MatError,
        MatHint,
        ColorPickerDirective,
        MatFabButton,
        TranslatePipe,
        MatDivider, MatSlider, MatSliderThumb]
})

export class ApartmentDialogComponent implements OnInit, OnDestroy {

    fb = inject(FormBuilder);
    dialog = inject(MatDialog);
    dialogRef = inject(MatDialogRef<ApartmentDialogComponent>);
    authStore = inject(AuthStore);
    unsubscribe$ = new Subject<void>();

    selectedLogo: File | null = null;
    selectedBackgroundImage: File | null = null;

    selectedPicture: string | undefined;
    selectedPictureBackground: string | undefined;

    isOpened: boolean = true;
    primaryColor: string = '#e920e9';
    secondaryColor: string = '#e920e9';
    dangerColor: string = '#e920e9';
    warnColor: string = '#e920e9';
    infoColor: string = '#e920e9';
    acceptColor: string = '#e920e9';

    form: FormGroup;
    languages: string[] = [];
    toBigImage: string = "";
    toBigBackgroundImage: string = "";

    arrayItems: {
        text: string;
        title: string;
        iso: string;
    }[] | undefined;

    selectedIsoTitle: string = defaultIso;
    isAdmin: boolean = false;
    isManager: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) private apartment: Apartment) {
        this.isAdmin = this.authStore.authorize(Roles.ADMIN);
        this.isManager = this.authStore.authorize(Roles.MANAGER);

        this.form = this.fb.group({
            id: [this.apartment?.id],
            host: [this.apartment?.host],
            primaryColor: [this.apartment?.primaryColor, Validators.required],
            secondaryColor: [this.apartment?.secondaryColor, Validators.required],
            primaryColorLight: this.apartment?.primaryColorLight,
            secondaryColorLight: [this.apartment?.secondaryColorLight],
            dangerColor: [this.apartment?.dangerColor],
            dangerColorLight: [this.apartment?.dangerColorLight],
            warnColor: [this.apartment?.warnColor],
            warnColorLight: [this.apartment?.warnColorLight],
            infoColor: [this.apartment?.infoColor],
            infoColorLight: [this.apartment?.infoColorLight],
            acceptColor: [this.apartment?.acceptColor],
            acceptColorLight: [this.apartment?.acceptColorLight],
            linearPercentage: [this.apartment?.linearPercentage ? this.apartment?.linearPercentage : 0],
            price: [this.apartment?.price],
            image: [this.apartment?.image],
            imageBackground: [this.apartment?.imageBackground],
            iso: this.fb.array([]),
            removePicture: this.apartment?.removePicture ? this.apartment?.removePicture : false,
            removePictureBackground: this.apartment?.removePictureBackground ? this.apartment?.removePictureBackground : false,
        });

        if (this.apartment?.iso?.length > 0) {
            this.apartment.iso.map(iso => this.addExisting(iso.title, iso.description, iso.iconText, iso.iso));
        } else {
            this.addItem(defaultIso);
        }

        if (this.apartment?.iso?.length > 0) {
            this.languages = this.apartment.iso.map(iso => iso.iso);
        } else {
            this.languages.push(defaultIso);
        }
        if (apartment?.image) {
            this.selectedLogo = apartment.image;
        }
        if (apartment?.imageBackground) {
            this.selectedBackgroundImage = apartment.imageBackground;
        }
        this.primaryColor = apartment?.primaryColor ? apartment.primaryColor : "";
        this.secondaryColor = apartment?.secondaryColor ? apartment.secondaryColor : "";

        this.dangerColor = apartment?.dangerColor ? apartment.dangerColor : "";
        this.warnColor = apartment?.warnColor ? apartment.warnColor : "";
        this.infoColor = apartment?.infoColor ? apartment.infoColor : "";
        this.acceptColor = apartment?.acceptColor ? apartment.acceptColor : "";
    }

    onChangePrimaryColor(color: any) {
        this.form.patchValue({primaryColor: color});
    }

    onChangeSecondaryColor(color: string) {
        this.form.patchValue({secondaryColor: color});
    }

    onChangeDangerColor(color: string) {
        this.form.patchValue({dangerColor: color});
    }

    onChangeWarnColor(color: string) {
        this.form.patchValue({warnColor: color});
    }

    onChangeInfoColor(color: string) {
        this.form.patchValue({infoColor: color});
    }

    onChangeAcceptColor(color: string) {
        this.form.patchValue({acceptColor: color});
    }

    createApartmentIso(iso: ApartmentIso) {
        return this.fb.group({
            description: [iso.description, [Validators.maxLength(2000)]],
            title: [iso.title, [Validators.minLength(3), Validators.maxLength(15)]],
            iso: [iso.iso],
            iconText: [iso.iconText, [Validators.minLength(3), Validators.maxLength(30)]],
        })
    }

    get isHostDemaApartments(): boolean {
        return this.form.get('host')?.value === Hosts.DEMA_APARTMENTS;
    }

    openClose() {
        this.isOpened = !this.isOpened;
    }

    get isoArray(): FormArray {
        return this.form.get('iso') as FormArray;
    }

    isIsoSelected(iso: ApartmentIso) {
        if (iso.iso === this.selectedIsoTitle) {
            return true;
        }
        return false
    }

    get iso() {
        return this.form.value.iso;
    }

    createApartment() {
        if (this.form.valid) {
            const apartmentProps = this.form.getRawValue() as Partial<Apartment>;
            const images = {image: this.selectedLogo, imageBackground: this.selectedBackgroundImage} as Partial<Apartment>;
            const mergedClone = merge(apartmentProps, images);
            console.log("mergedClone", mergedClone);
           this.dialogRef.close(mergedClone);
        }
    }

    ngOnInit() {
        this.arrayItems = [];
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    selectLogo(event: any) {

        if (event.target.files[0].size < 589000) {
            this.selectedLogo = event.target.files[0];
            if (this.selectedLogo) {
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

    get showPicture(): string | undefined {
        if (this.selectedPicture) {
            return this.selectedPicture;
        } else if (this.apartment?.image) {
            return 'data:image/jpg;base64,' + this.apartment.image
        }
        return;
    }

    get showBackgroundImage(): string | undefined {
        if (this.selectedPictureBackground) {
            return this.selectedPictureBackground;
        } else if (this.apartment?.imageBackground) {
            return 'data:image/jpg;base64,' + this.apartment.imageBackground
        }
        return;
    }


    get isNew(): boolean {
        return !this.form.value.id
    }

    chooseLanguages() {
        this.openChooseLanguageDialog(this.languages).pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(detailProps => {
                if (detailProps.includes(defaultIso)) {

                    this.languages = detailProps;

                    this.indexiKojiNePostojeUNovojAPostojeUStaroj(this.languages).forEach(
                        i => this.removeItem(i)
                    )
                    this.languages.forEach(
                        country => {
                            if (!this.isIsoExistInOldArray(country)) {
                                this.addItem(country);
                            }
                        }
                    );

                    if (!this.postojiSelektirani()) {
                        this.selectedIsoTitle = defaultIso;
                    }

                } else {
                   // console.log("engleski je obavezan");
                }
            }
        );
    }

    removeItem(index: number) {
        (this.form.get('iso') as FormArray).removeAt(index);
    }

    addItem(country: string) {
        (this.form.get('iso') as FormArray).push(this.createApartmentIso({
            title: "",
            description: "",
            iconText: "",
            iso: country
        }));
    }

    addExisting(title: string, description: string, iconText: string, country: string) {
        (this.form.get('iso') as FormArray).push(this.createApartmentIso({
            title: title,
            description: description,
            iconText: iconText,
            iso: country
        }));
    }

    postojiSelektirani() {

        let vrati: boolean = false;
        (this.form.get('iso') as FormArray).controls.forEach(
            t => {
                if (t.value.iso === this.selectedIsoTitle) {
                    vrati = true;
                }
            }
        );
        return vrati;

    }

    isIsoExistInOldArray(country: string) {
        let vrati: boolean = false;
        (this.form.get('iso') as FormArray).controls.forEach(
            t => {
                if (t.value.iso === country) {
                    vrati = true;
                }
            }
        );
        return vrati;
    }


    indexiKojiNePostojeUNovojAPostojeUStaroj(novaList: string[]) {
        const indexi: number[] = [];

        (this.form.get('iso') as FormArray).controls.forEach(
            (item, index) => {
                if (!novaList.includes(item.value.iso)) {
                    indexi.push(index);
                }
            }
        );
        return indexi;
    }

    openChooseLanguageDialog(chosenLanguages: string[]) {
        const dialogRef = this.dialog.open(ChooseIsoDialogComponent, {
            width: '400px',
            data: chosenLanguages,
        });

        return dialogRef.afterClosed();
    }

    activeIso(active: any) {
        this.selectedIsoTitle = active;
    }

    removePicture(event: any) {
        this.form.patchValue({removePicture: event.checked})
    }

    removePictureBackground(event: any) {
        this.form.patchValue({removePictureBackground: event.checked})
    }

    formatLabel(value: number): string {
        if (value >= 1000) {
            const bilo  = Math.round(value / 1000);
            return bilo + '';
        }
        return `${value}`;
    }

    onKeyUp(event:any){
        console.log("onKeyUp event", event);
    }

    changeSlider(event: any){
        this.form.patchValue({linearPercentage: event/1000})
    }

    get rate(){
          return this.form.value.linearPercentage;
    }

    protected readonly defaultIso = defaultIso;
}

///https://stackblitz.com/edit/angular-ckvs4z?file=src%2Fapp%2Fform-field-appearance-example.html
