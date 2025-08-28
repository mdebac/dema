import {Component, ElementRef, Inject, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApartmentStore} from "../../../services/apartments-store.service";
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApartmentItem, ApartmentItemDialogData} from "../../../domain/apartment-item";
import {defaultIso} from "../../../domain/countries-iso";
import {ApartmentItemIso} from "../../../domain/apartment-item-iso";
import {ValidateImageSize} from "../../../validators/image-size.validator";
import { MatSelectChange, MatSelect } from "@angular/material/select";
import { Editor, Toolbar, NgxEditorMenuComponent, NgxEditorComponent } from "ngx-editor";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { IsoButtonsComponent } from '../../iso-buttons/iso-buttons.component';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { NgIf, NgFor } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Chip } from "../../../domain/chip.enum";

@Component({
    selector: 'item-dialog',
    templateUrl: './item-dialog.component.html',
    styleUrl: './item-dialog.component.scss',
    imports: [MatCard, MatCardHeader, IsoButtonsComponent, MatCardContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatSelect, MatOption, NgIf, MatError, NgFor, MatInput, NgxEditorMenuComponent, NgxEditorComponent, MatButton, TranslatePipe]
})
export class ItemDialogComponent implements OnDestroy {
  //store = inject(ApartmentStore);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ItemDialogComponent>)
  translateService = inject(TranslateService);

  title: string = "";
  @ViewChild('fileUploader') fileUploader: ElementRef | undefined;
  form: FormGroup;
  languages: string[] | undefined | null = [];
  selectedIsoTitle: string = defaultIso;
  selectedType: Chip | null;
  selectedPicture: string | undefined;
  editorMap: Map<string, Editor>;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['align_left', 'align_center', 'align_right', 'align_justify','text_color', 'background_color'],
  ];
  colorPresets = [""];

  constructor(@Inject(MAT_DIALOG_DATA) private data: ApartmentItemDialogData) {
    console.log("item dialog incoming data", data);

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
              if (l === iso.iso) {
                this.addExisting(iso.title, iso.description, iso.iso);
                dodani.push(l);
              }
            }
          )
        }
      )
      this.data?.languages.forEach(
        l => {
          if (!dodani.includes(l)) {
            this.addItem(l);
          }
        }
      )
    } else {
      this.data?.languages?.map(iso => this.addItem(iso));
    }
    this.languages = this.data?.languages;

  }

  ngOnDestroy(): void {
    this.editorMap.forEach((editor: Editor, key: string) => {
      editor.destroy();
    });
    this.editorMap.clear();
  }

  get isoArray(): FormArray {
    return this.form.get('iso') as FormArray;
  }

  activeIso(active: any) {
    console.log("promjena iso", active);
    this.selectedIsoTitle = active;
  }


  editor = (iso: string): Editor => {
    const editor = this.editorMap.get(iso);
    if(editor){
      return editor;
    }
    return new Editor();
  };

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
    this.editorMap.set(iso.iso, new Editor());
    return this.fb.group({
      title: [iso.title, (iso.iso===defaultIso && this.selectedType === Chip.JOB) ? [Validators.maxLength(255),Validators.required] : [Validators.maxLength(255)]],
      description: [iso.description, [Validators.maxLength(2500)]],
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
}

//https://stackoverflow.com/questions/58238935/set-a-value-of-file-input-in-angular-8-when-editing-an-item

