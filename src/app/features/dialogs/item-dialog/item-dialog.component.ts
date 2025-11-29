import {Component, ElementRef, Inject, inject, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApartmentItem, ApartmentItemDialogData} from "../../../domain/apartment-item";
import {defaultIso} from "../../../domain/countries-iso";
import {ApartmentItemIso} from "../../../domain/apartment-item-iso";
import {ValidateImageSize} from "../../../validators/image-size.validator";
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


@Component({
    selector: 'item-dialog',
    templateUrl: './item-dialog.component.html',
    styleUrl: './item-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
    imports: [MatCard, MatCardHeader, IsoButtonsComponent, MatCardContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, MatError, MatInput, TranslatePipe, MatFabButton, QuillEditorComponent]
})
export class ItemDialogComponent {

  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ItemDialogComponent>)
  translateService = inject(TranslateService);

  title: string = "";
  @ViewChild('fileUploader') fileUploader: ElementRef | undefined;
  form: FormGroup;
  languages: Language[] | undefined | null = [];
  selectedIsoTitle: string = defaultIso;
  selectedType: Chip | null;
  selectedPicture: string | undefined;
  quillConfiguration: any;

  constructor(@Inject(MAT_DIALOG_DATA) private data: ApartmentItemDialogData) {

    this.form = this.fb.group({
      id: [this.data.item.id],
      detailId: [this.data.item.detailId, Validators.required],
      url: [this.data.item.url],
      chip: [!!this.data.item.chip ? this.data.item.chip : Chip.TEXT],
      iso: this.fb.array([]),
      image: [this.data.item.image]
    });

    if(this.data.item.chip){
      this.selectedType = this.data.item.chip;
    }
    else{
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



    const fonts = this.data?.fonts?.map(font=>font.family);
    this.quillConfiguration = {
      toolbar: [
        ['bold', 'italic',{align: ''}, {align: 'center'}, {align: 'right'}, {align: 'justify'},{
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

  isJobsEnabled(){
    return this.data.roles.includes(Roles.ADMIN.toUpperCase()) || (this.data.roles.includes(Roles.MANAGER.toUpperCase()) && this.data.host === Hosts.ADRIATICSUN_EU)
  }

  isDomainsEnabled(){
    return this.data.roles.includes(Roles.ADMIN.toUpperCase());
  }


  get isoArray(): FormArray {
    return this.form.get('iso') as FormArray;
  }

  activeIso(active: any) {
    this.selectedIsoTitle = active;
  }

  isIsoSelected(iso: ApartmentItemIso) {

    if (iso.iso === this.selectedIsoTitle) {
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
      title: [iso.title, (iso.iso===defaultIso && this.selectedType === Chip.JOB) ? [Validators.maxLength(255),Validators.required] : [Validators.maxLength(255)]],
      description: [iso.description, [Validators.maxLength(2000)]],
      iso: [iso.iso],
    })
  }

  remainingChars = (iso: string): number => {
    const list = (this.form.get('iso') as FormArray);

    // @ts-ignore
    return list.controls
      .map( val => val.value as ApartmentItemIso)
      .find(item => item.iso === iso)?.description.length;
  };

  remainingSize(iso: string){
    return this.translateService.instant('item.dialog.remaining.size', {length: this.remainingChars(iso) });
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
      this.form.controls['image'].addValidators([Validators.required,ValidateImageSize(1090000)]);
      this.form.controls['image'].updateValueAndValidity();
    } else {
      this.form.controls['image'].removeValidators([Validators.required, ValidateImageSize(1090000)]);
      this.form.controls['image'].updateValueAndValidity();
    }
  }

  selectImage(event: any) {
    this.form.patchValue({image: event.target.files[0]})
    if (event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
        this.form.patchValue({logoUrl:  null});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  get bookCover():string | undefined {

    if(this.selectedPicture){
      return this.selectedPicture;
    }else if (this.form.value.image){
      return 'data:image/jpg;base64,' + this.form.value.image
      //`data:${mimeType};base64,${content}`
    }
    return;
  }

  get isImageSelected(){
    return !!this.form.value.image;
  }

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

  protected readonly Chip = Chip;
  protected readonly Hosts = Hosts;
  protected readonly Roles = Roles;
}

//https://stackoverflow.com/questions/58238935/set-a-value-of-file-input-in-angular-8-when-editing-an-item

