import {Component, Inject, inject, OnDestroy} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule
} from "@angular/forms";
import {Apartment} from "../../../domain/apartment";
import {Subject} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatCard, MatCardHeader, MatCardContent} from '@angular/material/card';
import {MatFabButton} from '@angular/material/button';
import {MatFormField, MatLabel, MatHint} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {
    MatExpansionModule,
} from "@angular/material/expansion";
import {TranslatePipe} from "@ngx-translate/core";
import {MatDivider} from "@angular/material/divider";
import {AuthStore} from "../../../services/authentication/auth-store";
import {Roles} from "../../../domain/roles";

@Component({
    selector: 'apartment-dialog',
    templateUrl: './apartment-dialog.component.html',
    styleUrl: './apartment-dialog.component.scss',
    imports: [
    MatDivider,
    MatExpansionModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatFabButton,
    TranslatePipe,
    MatDivider
]
})

export class ApartmentDialogComponent implements OnDestroy {

    fb = inject(FormBuilder);
    dialog = inject(MatDialog);
    dialogRef = inject(MatDialogRef<ApartmentDialogComponent>);
    authStore = inject(AuthStore);
    unsubscribe$ = new Subject<void>();
    form: FormGroup;
    isAdmin: boolean = false;
    isManager: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) private apartment: Apartment) {
        this.isAdmin = this.authStore.authorize(Roles.ADMIN);
        this.isManager = this.authStore.authorize(Roles.MANAGER);

        this.form = this.fb.group({
            id: [this.apartment?.id],
            host: [this.apartment?.host,[Validators.required, Validators.minLength(3)]],
            });

    }

    createApartment() {
        if (this.form.valid) {
            const apartmentProps = this.form.getRawValue() as Partial<Apartment>;
          //  const images = {...apartmentProps, iconImage: this.selectedLogo, backgroundImage: this.selectedBackgroundImage} as Partial<Apartment>;
            this.dialogRef.close(apartmentProps);
        }
    }


    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    get isNew(): boolean {
        return !this.form.value.id
    }


}

///https://stackblitz.com/edit/angular-ckvs4z?file=src%2Fapp%2Fform-field-appearance-example.html
