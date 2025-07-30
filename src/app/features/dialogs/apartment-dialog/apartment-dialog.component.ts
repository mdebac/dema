import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {ApartmentStore} from "../../../services/apartments-store.service";
import {Apartment} from "../../../domain/apartment";
import {BehaviorSubject, debounceTime, Subject} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {ApartmentIso} from "../../../domain/apartment-iso";
import {filter, takeUntil} from "rxjs/operators";
import {ChooseIsoDialogComponent} from "../choose-iso-dialog/choose-iso-dialog.component";
import {defaultIso} from "../../../domain/countries-iso";
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { IsoButtonsComponent } from '../../iso-buttons/iso-buttons.component';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ColorPickerDirective } from 'ngx-color-picker';

@Component({
    selector: 'apartment-dialog',
    templateUrl: './apartment-dialog.component.html',
    styleUrl: './apartment-dialog.component.scss',
    imports: [MatCard, MatCardHeader, IsoButtonsComponent, MatIconButton, MatIcon, MatCardContent, FormsModule, ReactiveFormsModule, NgFor, MatFormField, MatLabel, MatInput, MatError, MatHint, ColorPickerDirective, MatButton]
})

export class ApartmentDialogComponent implements OnInit, OnDestroy{
  store = inject(ApartmentStore);
  fb = inject(FormBuilder);
  dialog = inject(MatDialog);

  unsubscribe$ = new Subject<void>();
 // private searchSubject = new BehaviorSubject<string|null>(this.apartment?.titleUrl??null);
 // private readonly debounceTimeMs = 300; // Set the debounce time (in milliseconds)

  selectedLogo: any = null;
  selectedPicture: string | undefined;

  primaryColor: string = '#e920e9';
  secondaryColor: string = '#e920e9';
  dangerColor: string = '#e920e9';
  warnColor: string = '#e920e9';
  infoColor: string = '#e920e9';
  acceptColor: string = '#e920e9';

  form:FormGroup;
  languages: string[] = [];

  arrayItems: {
      text: string;
      title: string;
      iso: string;
  }[] | undefined;

  selectedIsoTitle: string = defaultIso;

  constructor(@Inject(MAT_DIALOG_DATA) private apartment: Apartment) {

    this.form = this.fb.group({
      id: [this.apartment?.id],
      host: [this.apartment?.host],
      primaryColor: [this.apartment?.primaryColor,Validators.required],
      secondaryColor: [this.apartment?.secondaryColor,Validators.required],
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
      price: [5, [Validators.required,Validators.min(1)]],
      image: [this.apartment?.image],
      iso: this.fb.array([]),
   });

    if(this.apartment?.iso?.length > 0){
      this.apartment.iso.map(iso=> this.addExisting(iso.title,iso.text, iso.iconTitle, iso.iconText, iso.iso));
    }else{
      this.addItem(defaultIso);
    }

    if(this.apartment?.iso?.length > 0){
       this.languages = this.apartment.iso.map(iso => iso.iso);
    }else{
      this.languages.push(defaultIso);
    }

   // if(apartment?.titleUrl) {
    //  this.searchSubject.next(apartment?.titleUrl);
   // }
    if(apartment?.image){
      this.selectedLogo = apartment.image;
    }
    this.primaryColor = apartment?.primaryColor ? apartment.primaryColor : "";
    this.secondaryColor = apartment?.secondaryColor ? apartment.secondaryColor : "";

    this.dangerColor = apartment?.dangerColor ? apartment.dangerColor : "";
    this.warnColor = apartment?.warnColor ? apartment.warnColor : "";
    this.infoColor = apartment?.infoColor ? apartment.infoColor : "";
    this.acceptColor = apartment?.acceptColor ? apartment.acceptColor : "";

  }

  onChangePrimaryColor(color:any){
    this.form.patchValue({primaryColor:color});
  }

  onChangeSecondaryColor(color:string){
    this.form.patchValue({secondaryColor:color});
  }

  onChangeDangerColor(color:string){
    this.form.patchValue({dangerColor:color});
  }

  onChangeWarnColor(color:string){
    this.form.patchValue({warnColor:color});
  }

  onChangeInfoColor(color:string){
    this.form.patchValue({infoColor:color});
  }

  onChangeAcceptColor(color:string){
    this.form.patchValue({acceptColor:color});
  }

  createApartmentIso(iso: ApartmentIso) {
    return this.fb.group({
      text: [iso.text],
      title: [iso.title],
      iso: [iso.iso],
      iconText: [iso.iconText],
      iconTitle: [iso.iconTitle, [Validators.minLength(3), Validators.maxLength(15)]],
    })
  }

  iconTitleError(i:any){

    console.log("my i", this.iso[i].iconTitle.errors.minlength);

    return true;
  }

  minLength(i: number){

//    this.isoArray.controls[i].errors?.['minlength']

    return true;
  }
  maxLength(i: number){

   // const as = this.isoArray.controls[i].['iconTitle'].errors?.['maxlength'];

   // console.log("maxLength", as);
//

    return true;
  }

  get isoArray(): FormArray {
    return this.form.get('iso') as FormArray;
  }

  isIsoSelected(iso:ApartmentIso){
    if(iso.iso === this.selectedIsoTitle){
     return true;
    }
    return false
  }

  get iso(){
    return this.form.value.iso;
  }

  createApartment() {
    if (this.form.valid) {
      let apartmentProps = this.form.getRawValue() as Partial<Apartment>;

     if(this.selectedLogo){
        apartmentProps = {...apartmentProps, image:this.selectedLogo};
      }
     console.log("apartmentProps", apartmentProps);
     this.store.createApartmentEffect(apartmentProps);
     this.dialog.closeAll();
    }
  }

  ngOnInit() {
  //  this.searchSubject.pipe(debounceTime(this.debounceTimeMs)).subscribe((searchValue) => {
  //    this.store.generateUrlEffect(searchValue);
  //  });
   //this.store.generatedUrl$.subscribe(
   // s=> this.form.patchValue({titleUrl:s})
   // )
    this.arrayItems = [];
  }


  ngOnDestroy() {
   // this.searchSubject.complete();
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

 /* onSearch() {
    const isoArray = this.form.get('iso') as FormArray;
    isoArray.controls?.forEach(
      iso => {
        if(iso.value.iso === defaultIso){
          this.searchSubject.next(iso.value.title);
        }
      }
    )
  }
*/
  selectLogo(event: any){

    this.selectedLogo = event.target.files[0];
    if (this.selectedLogo) {

      const reader = new FileReader();
      reader.onload = () => {

        this.selectedPicture = reader.result as string;

        this.form.patchValue({logoUrl:  null});
      };
      reader.readAsDataURL(this.selectedLogo);
    }
  }

  get bookCover():string | undefined {
    if(this.selectedPicture){
      return this.selectedPicture;
    }else if (this.apartment?.image){
      return 'data:image/jpg;base64,' + this.apartment.image
    }
    return;
  }

  get isNew():boolean{
    return !this.form.value.id
  }

  chooseLanguages(){
    console.log("already chosen languages - open choose dialog", this.languages);

    this.openChooseLanguageDialog(this.languages).pipe(
      filter(val=>!!val),
      takeUntil(this.unsubscribe$)
    ).subscribe( detailProps =>
    {
     if(detailProps.includes(defaultIso)){

       this.languages=detailProps;

       this.indexiKojiNePostojeUNovojAPostojeUStaroj(this.languages).forEach(
         i=> this.removeItem(i)
       )
       this.languages.forEach(
         country => {
           if(!this.isIsoExistInOldArray(country)){
             this.addItem(country);
           }
         }
       );

       if(!this.postojiSelektirani()){
         this.selectedIsoTitle = defaultIso;
       }

     }else{
       console.log("engleski je obavezan");
     }
    }
    );
  }

  removeItem(index:number) {
    (this.form.get('iso') as FormArray).removeAt(index);
  }

  addItem(country:string) {
    (this.form.get('iso') as FormArray).push(this.createApartmentIso({title: "", text:"", iconText:"", iconTitle:"", iso:country}));
  }

 addExisting(title: string, text: string, iconTitle:string, iconText:string,  country:string) {
    (this.form.get('iso') as FormArray).push(this.createApartmentIso({title: title, text: text, iconText: iconText,  iconTitle:iconTitle, iso:country}));
 }

  postojiSelektirani() {

    let vrati:boolean = false;
    (this.form.get('iso') as FormArray).controls.forEach(
      t => {
        if(t.value.iso === this.selectedIsoTitle){
          vrati = true;
        }
      }
    );
    return vrati;

  }

  isIsoExistInOldArray(country:string) {
    let vrati:boolean = false;
    (this.form.get('iso') as FormArray).controls.forEach(
      t => {
        if(t.value.iso === country){
          vrati = true;
        }
      }
    );
    return vrati;
  }


  indexiKojiNePostojeUNovojAPostojeUStaroj(novaList:string[]) {
    const indexi:number[] = [];

    (this.form.get('iso') as FormArray).controls.forEach(
      (item, index) => {
        if(!novaList.includes(item.value.iso)){
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

  activeIso(active:any){
    this.selectedIsoTitle = active;
  }

  protected readonly defaultIso = defaultIso;
}
///https://stackblitz.com/edit/angular-ckvs4z?file=src%2Fapp%2Fform-field-appearance-example.html
