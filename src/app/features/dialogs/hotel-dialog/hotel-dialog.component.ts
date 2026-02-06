import {Component, ElementRef, Inject, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../../domain/apartment-detail";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Subject} from "rxjs";
import {defaultIso} from "../../../domain/countries-iso";
import {ContentChange, QuillEditorComponent, QuillViewComponent} from 'ngx-quill'
import {TranslatePipe} from "@ngx-translate/core";
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {IsoButtonsComponent} from '../../iso-buttons/iso-buttons.component';
import {MatError} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {filter, takeUntil} from "rxjs/operators";
import {ChooseIconDialogComponent} from "../choose-icon-dialog/choose-icon-dialog.component";
import {MenuIso} from "../../../domain/menu-iso";
import {PanelIso} from "../../../domain/panel-iso";
import {Layout} from "../../../domain/layout";
import {Side} from "../../../domain/side";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {Menu} from "../../../domain/menu";
import {Hosts} from "../../../domain/hosts";
import {MatTooltip} from "@angular/material/tooltip";
import {Language} from "../../../domain/language";
import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";
import {Cropper} from "../../../domain/cropper";
import {MatFabButton} from "@angular/material/button";
import {TopMenuType} from "../../../domain/top-menu-type";
import {SideMenuType} from "../../../domain/side-menu-type";

@Component({
  selector: 'hotel-dialog',
  templateUrl: './hotel-dialog.component.html',
  styleUrl: './hotel-dialog.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
    ReactiveFormsModule,
    MatCardContent,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    IsoButtonsComponent,
    MatCardHeader,
    MatCard,
    QuillViewComponent,
    MatIcon,
    QuillEditorComponent,
    ImageCropperComponent,
    TranslatePipe,
    MatCheckbox,
    MatTooltip,
    MatError,
    MatExpansionPanelHeader,
    MatFabButton,
  ]

})
export class HotelDialogComponent extends Cropper implements OnDestroy, OnInit {

  dialog = inject(MatDialog);
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<HotelDialogComponent>)
  form: FormGroup;
  languages: Language[] | undefined = [];
  selectedIso: string = defaultIso;
  quillConfiguration: any;
  isOpened: boolean = true;
  initTop: boolean = true;
  initSide: boolean = true;
  topFile: any = "";
  toBigTopMenuImage: string = "";
  selectedTopMenuImage: string | null | ArrayBuffer = null;
  selectedTopMenuImageFile: File | null = null;
  selectedSideMenuImage: string | null | ArrayBuffer = null;
  selected: { [id: number]: boolean }[] = [];

  hotelSideMenu: string[] = ['apple', 'jabuka'];

  unsubscribe$ = new Subject<void>();
  @ViewChild('topMenuImageInput', {static: false}) topMenuImageInput: ElementRef | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) private data: ApartmentDetailDialogData) {
    super();

    this.selectedIso = data.selectedIso;
    const fonts = data?.fonts?.map(font => font.family);

    this.selected.push({[1]:true},{[2]:true},{[3]:true});
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
        [{ 'size': ['1.25em', '2.3em'] }],                  // custom dropdown
        // [{'header': [1, 2, 3, 4, 5, 6, false]}],
        // dropdown with defaults from theme
        [{'font': fonts}],                     // whitelist of fonts
        // [{'align': []}],
        ['clean'],
        // ['link']                                          // link and image, video
      ]
    };

    this.form = this.fb.group({
      id: [this.data.detail.id],
      columns: [this.data.detail.columns ? this.data.detail.columns : 1],
      backgroundColor: [this.data.detail.backgroundColor ? this.data.detail.backgroundColor : ""],
      cornerRadius: [this.data.detail.cornerRadius ? this.data.detail.cornerRadius : 16],
      show: [this.data.detail.show],

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
    });


    if (this.data?.languages && this.data?.languages.length > 0) {
      const dodaniMenu: string[] = [];
      this.data?.languages.forEach(
          l => {

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

          }
      )
      this.data?.languages.forEach(
          l => {
            if (!dodaniMenu.includes(l.iso)) {
              this.addMenuItem(l.iso);
            }
          }
      )
    } else {
      //   this.data?.languages?.map(iso => this.addItem(iso));
    }
    this.languages = this.data?.languages;
  }



  createSideMenuType(type: SideMenuType) {
    return this.fb.group({
      type: [type],
    })
  }





  ngOnInit(): void {
    this.initTop = true;
    this.initSide = true;
  }


  addMenuItem(country: string) {
    (this.form.get('topMenu')?.get('iso') as FormArray).push(this.createTopMenuIso({
      title: "",
      description: "",
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


  createTopMenuIso(iso: MenuIso) {
    return this.fb.group({
      title: [iso.title, iso.iso === defaultIso ? [Validators.required, Validators.minLength(2), Validators.maxLength(255)] : [Validators.minLength(2), Validators.maxLength(255)]],
      description: [iso.description, [Validators.minLength(2), Validators.maxLength(500)]],
      iso: [iso.iso],
    })
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

  onCreateDetail() {
    if (this.form.valid) {
      // const topMenu = this.form.get('topMenu')?.value as Partial<Menu>;
      // const topMenuPayload = {
      //   ...topMenu,
      //   type: TopMenuType.HOTEL,
      // } as Partial<ApartmentDetail>;
      const detail = this.form.getRawValue() as Partial<ApartmentDetail>;
      // const detailPayload = {
      //   ...detail,
      //   topMenu: topMenuPayload,
      // } as Partial<ApartmentDetail>;
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

  get topMenuIcon() {
    return this.form.value.topMenu.icon;
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

  openChooseIconDialog() {
    const dialogRef = this.dialog.open(ChooseIconDialogComponent, {
      width: '25rem',
    });
    return dialogRef.afterClosed();
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

  onContentChangedTopTitle($event: ContentChange) {
    const url = $event.text.toLowerCase().replaceAll(" ", "_").replaceAll("\n", "");
    if (this.selectedIso === defaultIso) {
      this.form.get('topMenu')?.patchValue({
        menuUrl: url
      });
    }
  }

  isIsoSelected(iso: string) {

    if (iso === this.selectedIso) {
      return true;
    }
    return false
  }

  selectOne( item: any, select:boolean){
    console.log("selectOne", item, select);
  }

  protected readonly Layout = Layout;
  protected readonly Side = Side;
  protected readonly Hosts = Hosts;
  protected readonly Object = Object;
}



