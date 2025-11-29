import {Component, inject, Input, OnDestroy} from '@angular/core';
import {ApartmentItemIso} from "../../../../domain/apartment-item-iso";
import {ApartmentStore} from "../../../../services/apartments-store.service";
import {Subject} from "rxjs";
import {filter, takeUntil} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {FormsModule} from '@angular/forms';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'job',
    templateUrl: './job.component.html',
    styleUrl: './job.component.scss',
    imports: [FormsModule, MatIcon, TranslatePipe, MatFabButton]
})
export class JobComponent implements OnDestroy {

    store = inject(ApartmentStore);
    unsubscribe$ = new Subject<void>();
    // error$ = this.store.error$.pipe(filter((e) => !!e));
    dialog = inject(MatDialog);

    @Input() item: ApartmentItemIso[] = [];
    @Input() selectedIso: string = "";
    @Input() columns: number = 1;
    @Input() itemId: number = 1;
    @Input() loggedIn: boolean = false;


    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();

    }

    getDescription(country: string | null, iso: ApartmentItemIso[] | undefined) {
        return iso?.find(iso => iso.iso === country)?.description;
    }

    getTitle(country: string | null, iso: ApartmentItemIso[] | undefined) {
        return iso?.find(iso => iso.iso === country)?.title;
    }

    openCV(itemId: number) {
        this.openCvDialog(itemId).pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(cvDataProps => {
                // this.cvStore.createCvDataEffect(cvDataProps)
                console.log("openCV createCvData dialog props", cvDataProps);
            }
        );
    }

    openRegistrationWarning(){
    //open Dialog for Registration



    }

    openCvDialog(itemId: number) {
        // @ts-ignore
        const dialogRef = this.dialog.open(CvDataDialogComponent, {
            width: '31rem',
            panelClass: "dialog-panel",
            data: itemId,
        });
        return dialogRef.afterClosed();
    }

}
