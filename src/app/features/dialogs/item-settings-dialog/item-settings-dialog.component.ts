import {Component, Inject, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApartmentItem, ApartmentItemDialogData} from "../../../domain/apartment-item";
import {Colors} from "../../../domain/colors";
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonToggleGroup, MatButtonToggle } from '@angular/material/button-toggle';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import {Chip} from "../../../domain/chip.enum";

@Component({
    selector: 'item-settings-dialog',
    templateUrl: './item-settings-dialog.component.html',
    styleUrl: './item-settings-dialog.component.scss',
    imports: [MatCard, MatCardHeader, MatCardContent, FormsModule, ReactiveFormsModule, MatLabel, MatButtonToggleGroup, MatButtonToggle, MatDivider, MatButton]
})
export class ItemSettingsDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<ItemSettingsDialogComponent>)
  form: FormGroup;
  colors: Colors | null | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) private data: ApartmentItemDialogData) {

    this.form = this.fb.group({
      id: [this.data.item.id],
      detailId: [this.data.item.detailId, Validators.required],
      rowSpan: [this.data.item.rowSpan],
      colSpan: [this.data.item.colSpan],
      cornerRadius: [this.data.item.cornerRadius],
      elevation: [this.data.item.elevation],
      backgroundColor: [this.data.item.backgroundColor],
      chip: Chip.SETTINGS
    });
    this.colors = this.data.colors;
  }

  onCreateItemSettings() {
    if (this.form.valid) {
      const detailProps = this.form.getRawValue() as Partial<ApartmentItem>;
      this.dialogRef.close(detailProps);
    }
  }

  onChangeElevation($event: any) {
    this.form.patchValue({elevation: $event.value});
  }

  onChangeBackgroundColor($event: any) {
    this.form.patchValue({backgroundColor: $event.value});
  }


  onChangeRowSpan($event: any) {
    this.form.patchValue({rowSpan: $event.value});
  }

  onChangeColSpan($event: any) {
    this.form.patchValue({colSpan: $event.value});
  }

  onChangeCornerRadius($event: any) {
    this.form.patchValue({cornerRadius: $event.value});
  }

  get backgroundColor(): string {
    if (this.form.value?.backgroundColor) {
      return this.form.value.backgroundColor;
    }
    return "";
  }

  get elevation(): number {
    if (this.form.value?.elevation) {
      return this.form.value.elevation;
    }
    return 0;
  }

  get rowSpan(): number {
    if (this.form.value?.rowSpan) {
      return this.form.value.rowSpan;
    } else {
      this.form.patchValue({rowSpan: 1});
      return 1;
    }
  }

  get colSpan(): number {
    if (this.form.value?.colSpan) {
      return this.form.value.colSpan;
    } else {
      this.form.patchValue({colSpan: 1});
      return 1;
    }
  }

  get cornerRadius(): number {
    if (this.form.value?.cornerRadius) {
      return this.form.value.cornerRadius;
    } else {
      this.form.patchValue({cornerRadius: 10});
      return 10;
    }
  }

}

//https://stackoverflow.com/questions/58238935/set-a-value-of-file-input-in-angular-8-when-editing-an-item

