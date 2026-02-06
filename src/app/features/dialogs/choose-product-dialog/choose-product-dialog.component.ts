import {Component, Inject, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ProductType} from "../../../domain/product-type";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatLabel} from "@angular/material/input";
import {MatFormField} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";

@Component({
    selector: 'choose-product-dialog',
    imports: [
        FormsModule,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        ReactiveFormsModule,
    ],
    templateUrl: './choose-product-dialog.component.html',
    styleUrl: './choose-product-dialog.component.scss',
})
export class ChooseProductDialogComponent {

    dialogRef = inject(MatDialogRef<ChooseProductDialogComponent>)

    products: ProductType[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) private data: ProductType[]) {
        this.products = data;
    }

    changeType(productId: any) {
        this.dialogRef.close(productId.value);
    }

}
