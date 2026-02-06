import {Component, ElementRef, HostBinding, Inject, inject, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApartmentItem, ApartmentItemDialogData} from "../../../domain/apartment-item";
import {defaultIso} from "../../../domain/countries-iso";
import {ApartmentItemIso} from "../../../domain/apartment-item-iso";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {IsoButtonsComponent} from '../../iso-buttons/iso-buttons.component';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatInput} from '@angular/material/input';
import {MatFabButton} from '@angular/material/button';
import {Chip} from "../../../domain/chip.enum";
import {Hosts} from "../../../domain/hosts";
import {Roles} from "../../../domain/roles";
import {QuillEditorComponent} from "ngx-quill";
import {Language} from "../../../domain/language";
import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";
import {Cropper} from "../../../domain/cropper";
import {ImageAlign, imageAlignTypes} from "../../../domain/image-align";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatSlider, MatSliderThumb} from "@angular/material/slider";


@Component({
    selector: 'item-dialog',
    templateUrl: './item-dialog.component.html',
    styleUrl: './item-dialog.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [MatCard, MatCardHeader, IsoButtonsComponent, MatCardContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatError, MatInput, TranslatePipe, MatFabButton, QuillEditorComponent, ImageCropperComponent, MatRadioButton, MatRadioGroup, MatSlider, MatSliderThumb]
})
export class ItemDialogComponent extends Cropper {

    fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<ItemDialogComponent>)
    translateService = inject(TranslateService);

    title: string = "";
    @ViewChild('fileUploader') fileUploader: ElementRef | undefined;
    form: FormGroup;
    languages: Language[] | undefined | null = [];
    selectedIso: string = defaultIso;
    selectedType: Chip | null;
    selectedPicture: string | null | ArrayBuffer | undefined;
    quillConfiguration: any;
    toBigImage: string = "";
    selectedLogo: File | null = null;
    selectedImageAlign: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) private data: ApartmentItemDialogData) {
        super();
        this.selectedIso = data.selectedIso;
        this.form = this.fb.group({
            id: [this.data.item.id],
            detailId: [this.data.item.detailId, Validators.required],
            url: [this.data.item.url],
            chip: [!!this.data.item.chip ? this.data.item.chip : Chip.TEXT],
            iso: this.fb.array([]),
            image: [this.data.item.image],
            imageHeight: [this.data.item.imageHeight ? this.data.item.imageHeight : 100],
            imageWidth: [this.data.item.imageWidth ? this.data.item.imageWidth : 100],
            imageAlignVertical: [this.data.item.imageAlignVertical ? this.data.item.imageAlignVertical : ImageAlign.START],
            imageAlignHorizontal: [this.data.item.imageAlignHorizontal ? this.data.item.imageAlignHorizontal : ImageAlign.START],
        });

        if (this.data.item.chip) {
            this.selectedType = this.data.item.chip;
        } else {
            this.selectedType = Chip.TEXT;
        }

        if (this.data?.languages && this.data?.languages.length > 0) {
            const dodani: string[] = [];
            this.data?.languages.forEach(
                l => {
                    this.data?.item.iso?.forEach(
                        iso => {
                            if (l.iso === iso.iso) {
                                this.addExisting(iso.title, iso.description, iso.iso);
                                dodani.push(l.iso);
                            }
                        }
                    )
                }
            )
            this.data?.languages.forEach(
                l => {
                    if (!dodani.includes(l.iso)) {
                        this.addItem(l.iso);
                    }
                }
            )
        } else {
            this.data?.languages?.map(iso => this.addItem(iso.iso));
        }
        this.languages = this.data?.languages;

        const fonts = this.data?.fonts?.map(font => font.family);
        this.quillConfiguration = {
            toolbar: [
                ['bold', 'italic', {align: ''}, {align: 'center'}, {align: 'right'}, {align: 'justify'}, {
                    'color': [
                        this.data?.colors?.primaryColor ? this.data?.colors?.primaryColor : "",
                        this.data?.colors?.secondaryColor ? this.data?.colors?.secondaryColor : "",
                        this.data?.colors?.acceptColor ? this.data?.colors?.acceptColor : "",
                        this.data?.colors?.warnColor ? this.data?.colors?.warnColor : "",
                        this.data?.colors?.dangerColor ? this.data?.colors?.dangerColor : "",
                        this.data?.colors?.infoColor ? this.data?.colors?.infoColor : "",
                        "black",
                        "white"
                    ]
                }, {
                    'background': [
                        this.data?.colors?.primaryColor ? this.data?.colors?.primaryColor : "",
                        this.data?.colors?.secondaryColor ? this.data?.colors?.secondaryColor : "",
                        this.data?.colors?.acceptColor ? this.data?.colors?.acceptColor : "",
                        this.data?.colors?.warnColor ? this.data?.colors?.warnColor : "",
                        this.data?.colors?.dangerColor ? this.data?.colors?.dangerColor : "",
                        this.data?.colors?.infoColor ? this.data?.colors?.infoColor : "",
                        "black",
                        "white"
                    ]
                }],
                // ['blockquote', 'code-block'],
                //[{'header': 1}, {'header': 2}],                                      // custom button values
                [{'list': 'ordered'}, {'list': 'bullet'}],
                // [{'script': 'sub'}, {'script': 'super'}],                            // superscript/subscript
                // [{'indent': '-1'}, {'indent': '+1'}],
               [{ 'size': ['1.25em', '1.8em', '2.3em', '4em', '6.25em'] }],
              //  [{'size': ['small', 'normal', 'large', 'huge']}],                       // custom dropdown
                // [{'header': [1, 2, 3, 4, 5, 6, false]}],
                // dropdown with defaults from theme
                [{'font': fonts}],      // whitelist of fonts
                // [{'align': []}],
                 ['clean'],
                // ['link']                                          // link and image, video
            ]
        };

    }

    isJobsEnabled() {
        return this.data.roles.includes(Roles.ADMIN.toUpperCase()) || (this.data.roles.includes(Roles.MANAGER.toUpperCase()) && this.data.host === Hosts.ADRIATICSUN_EU)
    }

    isShoppingEnabled(){
        return this.data.roles.includes(Roles.ADMIN.toUpperCase()) || (this.data.roles.includes(Roles.MANAGER.toUpperCase()) && this.data.host === Hosts.DEMA_APARTMENTS)
    }

    isAdmin() {
        return this.data.roles.includes(Roles.ADMIN.toUpperCase());
    }

    get isoArray(): FormArray {
        return this.form.get('iso') as FormArray;
    }

    activeIso(active: any) {
        this.selectedIso = active;
    }

    isIsoSelected(iso: ApartmentItemIso) {

        if (iso.iso === this.selectedIso) {
            return true;
        }
        return false
    }

    addItem(country: string) {
        (this.form.get('iso') as FormArray).push(this.createItemIso({title: "", description: "", iso: country}));
    }

    addExisting(title: string, description: string, country: string) {
        (this.form.get('iso') as FormArray).push(this.createItemIso({
            title: title,
            description: description,
            iso: country
        }));
    }

    createItemIso(iso: ApartmentItemIso) {
        return this.fb.group({
            title: [iso.title, (iso.iso === defaultIso && this.selectedType === Chip.JOB) ? [Validators.maxLength(255), Validators.required] : [Validators.maxLength(255)]],
            description: [iso.description, [Validators.maxLength(3000)]],
            iso: [iso.iso],
        })
    }

    remainingChars = (iso: string): number => {
        const list = (this.form.get('iso') as FormArray);

        // @ts-ignore
        return list.controls
            .map(val => val.value as ApartmentItemIso)
            .find(item => item.iso === iso)?.description?.length;
    };

    remainingSize(iso: string) {
        return this.translateService.instant('item.dialog.remaining.size', {length: this.remainingChars(iso)});
    }

    get isNew(): boolean {
        return !this.form.value.id
    }

    onCreateItem() {
        if (this.form.valid) {
            const detailProps = this.form.getRawValue() as Partial<ApartmentItem>;
            this.dialogRef.close(detailProps);
        }
    }

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    changeType(change: MatSelectChange) {
        this.selectedType = change.value;

        if (change.value === Chip.PICTURE) {
            this.form.controls['image'].addValidators([Validators.required]);
            this.form.controls['image'].updateValueAndValidity();
        } else {
            this.form.controls['image'].removeValidators([Validators.required]);
            this.form.controls['image'].updateValueAndValidity();
        }
    }

    get showPicture(): string | undefined | ArrayBuffer {
        if (this.selectedPicture) {
            return this.selectedPicture;
        }


          if(this.selectedPicture){
            return this.selectedPicture;
          }else if (this.form.value.image){
            return 'data:image/jpg;base64,' + this.form.value.image;
            //`data:${mimeType};base64,${content}`
          }
        return ;

    }

    selectImage(event: any) {
        this.toBigImage = "";
        if (event.target?.files[0]?.size < 1789000) {
            this.selectedLogo = event.target.files[0];
            if (this.selectedLogo) {
                this.itemFile = {};

                this.form.patchValue({logoUrl: null});
                this.form.patchValue({image: this.selectedLogo});

                const reader = new FileReader();
                reader.onload = () => {
                    this.selectedPicture = reader.result as string;
                };
                reader.readAsDataURL(this.selectedLogo);
            }
        } else {
            //optimizied it
            const file = event.target.files[0];
            const ext = this.getFilenameExtension(file);
            const type = file.type;
            this.itemFile = {
                ext: ext,
                file: file,
                type: type,
            };

        }
    }

    // get bookCover():string | undefined | ArrayBuffer {
    //   if(this.selectedPicture){
    //     return this.selectedPicture;
    //   }else if (this.form.value.image){
    //     return 'data:image/jpg;base64,' + this.form.value.image
    //     //`data:${mimeType};base64,${content}`
    //   }
    //   return;
    // }

    // get isImageSelected(){
    //   return !!this.form.value.image;
    // }

    get isImageTypeSelected() {
        return this.selectedType === Chip.PICTURE;
    }

    get isJobTypeSelected() {
        return this.selectedType === Chip.JOB;
    }

    get isVideoTypeSelected() {
        return this.selectedType === Chip.VIDEO;
    }

    get isTextTypeSelected() {
        return this.selectedType === Chip.TEXT;
    }

    itemImageCropped(event: ImageCroppedEvent) {
        if (event.objectUrl) {
            fetch(event.objectUrl)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        this.selectedPicture = reader.result as string;
                    };
                    reader.readAsDataURL(blob);

                    if (blob.size > 1000000) {
                        this.toBigImage = "Image to big";
                    } else {
                        this.form.patchValue({logoUrl: null});
                        this.form.patchValue({image: blob});
                    }

                });
        }
    }

    get imageWidth() {
        return this.form.value.imageWidth;
    }
    get imageHeight() {
       return this.form.value.imageHeight;
    }

    @HostBinding("style.--imageHeight")
    get imageHeightPercentage() {
        return this.form.value.imageHeight + '%';
    }

    @HostBinding("style.--imageWidth")
    get imageWidthPercentage() {
        return this.form.value.imageWidth + '%';
    }

    @HostBinding("style.--imageAlignVertical")
    get imageAlignVertical() {
        return this.form.value.imageAlignVertical;
    }

    @HostBinding("style.--imageAlignHorizontal")
    get imageAlignHorizontal() {
        return this.form.value.imageAlignHorizontal;
    }

    /*
           imageHeight: [this.data.item.imageHeight],
                imageWidth: [this.data.item.imageWidth],
                imageAlignVertical: [this.data.item.imageAlignVertical],
                imageAlignHorizontal: [this.data.item.imageAlignHorizontal]
     */
    onChangeImageAlign(selectedOption: MatOption) {

      //  console.log("onChangeImageAlign", selectedOption.source.value);

        // if (this.selectedImageAlign) {
        //     if (selectedOption.checked) {
        //         this.selectedImageAlign = selectedOption.source.value;
        //     }
        // }
        //
        // const apartmentProps = {
        //     ...this.header?.main,
        //     fonts: this.selectedFamilies,
        // } as Partial<Apartment>;
        // this.store.createMainEffect(apartmentProps);
    }

    getCheckedImageAlign(align: string) {
        console.log("getCheckedImageAlign", align);
        if (this.selectedImageAlign) {
            return true;
        } else {
            return false;
        }

    }

    formatLabel(value: number): string {
        return `${value}`;
    }

    changeImageWidthSlider(event: any) {
        console.log("changeImageWidthSlider", event);
        this.form.patchValue({imageWidth: event});
    }

    changeImageHeightSlider(event: any) {
        console.log("changeImageHeightSlider", event);
        this.form.patchValue({imageHeight: event});
    }

    protected readonly Chip = Chip;
    protected readonly Hosts = Hosts;
    protected readonly Roles = Roles;
    protected readonly Object = Object;
    protected readonly imageAlignTypes = imageAlignTypes;
}

//https://stackblitz.com/edit/angular-ivy-ep8sbb?file=src%2Fapp%2Fapp.component.ts
//https://stackoverflow.com/questions/58238935/set-a-value-of-file-input-in-angular-8-when-editing-an-item

