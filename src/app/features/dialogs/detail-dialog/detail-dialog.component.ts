import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";

import {ApartmentDetail, ApartmentDetailDialogData} from "../../../domain/apartment-detail";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {debounceTime, Subject} from "rxjs";
import {ApartmentDetailIso} from "../../../domain/apartment-detail-iso";
import {defaultIso} from "../../../domain/countries-iso";
import { Editor, Toolbar, NgxEditorMenuComponent, NgxEditorComponent } from "ngx-editor";
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { IsoButtonsComponent } from '../../iso-buttons/iso-buttons.component';
import { NgFor } from '@angular/common';
import { MatLabel, MatFormField, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'detail-dialog',
    templateUrl: './detail-dialog.component.html',
    styleUrl: './detail-dialog.component.scss',
    imports: [MatCard, MatCardHeader, IsoButtonsComponent, MatCardContent, FormsModule, ReactiveFormsModule, NgFor, MatLabel, NgxEditorMenuComponent, NgxEditorComponent, MatFormField, MatInput, MatError, MatHint, MatIcon, MatButton, TranslatePipe]
})
export class DetailDialogComponent implements OnDestroy{
 // store = inject(ApartmentStore);
  translateService = inject(TranslateService);

  private searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 300; // Set the debounce time (in milliseconds)

  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<DetailDialogComponent>)
  //title:string|undefined;
 // generatedDetailedUrl$ = this.store.generatedDetailedUrl$;

  form:FormGroup;
  languages: string[] | undefined = [];
  selectedIsoTitle: string = defaultIso;
  editorMap: Map<string, Editor>;
  toolbar: Toolbar = [
    ['bold','italic', { heading: ['h1', 'h2'] },'underline', 'text_color'],
  ];
  colorPresets = [""];

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
      mainId: [this.data.detail.mainId, Validators.required],
      host: [this.data.host, Validators.required],
      columns: [this.data.detail.columns ? this.data.detail.columns : 1],
      show: [this.data.detail.show],
      icon: [this.data.detail.icon],
      titleUrl: [this.data.detail.titleUrl],
      iso: this.fb.array([]),
    });

    if(this.data?.languages && this.data?.languages.length > 0){
      const dodani:string[] = [];
      this.data?.languages.forEach(
        l => {
          this.data?.detail.iso?.forEach(
            iso => {
              if(l===iso.iso){
                this.addExisting(iso.title,iso.label, iso.iso);
                dodani.push(l);
              }
            }
          )
        }
      )
      this.data?.languages.forEach(
        l=>{
          if(!dodani.includes(l)){
            this.addItem(l);
          }
        }
      )
    }else{
        this.data?.languages?.map(iso => this.addItem(iso));
    }

    this.languages = this.data?.languages;
  }


  editor = (iso: string): Editor => {
    const editor = this.editorMap.get(iso);
    if(editor){
      return editor;
    }
    return new Editor();
  };

  addItem(country:string) {
    (this.form.get('iso') as FormArray).push(this.createApartmentDetailIso({title: "", label:"", iso:country}));
  }

  addExisting(title: string, label: string, country:string) {
    (this.form.get('iso') as FormArray).push(this.createApartmentDetailIso({title: title, label: label, iso:country}));
  }

  createApartmentDetailIso(iso: ApartmentDetailIso) {
    this.editorMap.set(iso.iso, new Editor());
    return this.fb.group({
      title: [iso.title, [Validators.minLength(2), Validators.maxLength(150)]],
      label: [iso.label, iso.iso===defaultIso ? [ Validators.required, Validators.minLength(2), Validators.maxLength(10)] : [Validators.minLength(2), Validators.maxLength(10)]],
      iso: [iso.iso],
    })
  }

  get isNew():boolean{
    return !this.form.value.id
  }

  get isoArray(): FormArray {
   // console.log('getting the test array', this.form.get('iso'));
    return this.form.get('iso') as FormArray;
  }

  isIsoSelected(iso:ApartmentDetailIso){
    if(iso.iso === this.selectedIsoTitle){
      return true;
    }
    return false
  }

  closeDialog(){
    this.dialogRef.close();
  }

  onCreateDetail() {
    if (this.form.valid) {
      const detailProps = this.form.getRawValue() as Partial<ApartmentDetail>;
      console.log("onCreateDetail valid form", detailProps);
      this.dialogRef.close(detailProps);
    }
  }

  ngOnDestroy() {
    this.searchSubject.complete();
    this.editorMap.forEach((editor: Editor, key: string) => {
     editor.destroy();
    });
    this.editorMap.clear();
  }

  activeIso(active:any){
    this.selectedIsoTitle = active;
  }

  remainingChars = (iso: string): number => {
    const list = (this.form.get('iso') as FormArray);

    // @ts-ignore
    return list.controls
      .map( val => val.value as ApartmentDetailIso)
      .find(item => item.iso === iso)?.title.length;
  };

  remainingSize(iso: string){
    return this.translateService.instant('detail.dialog.remaining.size', {length: this.remainingChars(iso) });
  }

  /*onSearch() {
    const isoArray = this.form.get('iso') as FormArray;
    isoArray.controls?.forEach(
      iso => {
        if(iso.value.iso === defaultIso){
          this.searchSubject.next(iso.value.title);
        }
      }
    )
  }*/
get icon(){
    return this.form.value.icon;
}

}



