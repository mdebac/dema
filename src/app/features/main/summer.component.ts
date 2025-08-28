import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    inject,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';
import {CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag} from "@angular/cdk/drag-drop";
import {filter, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService, TranslatePipe} from "@ngx-translate/core";
import {Editor, NgxEditorComponent} from "ngx-editor";
import {LetDirective} from '@ngrx/component';
import {MatCard, MatCardHeader, MatCardContent} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {MatButtonToggleGroup, MatButtonToggle} from '@angular/material/button-toggle';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {WidgetComponent} from "../widget/widget.component";
import {ApartmentStore} from "../../services/apartments-store.service";
import {Colors} from "../../domain/colors";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../domain/apartment-detail";
import {ConformationDialogComponent} from "../dialogs/conformation-dialog/conformation-dialog.component";
import {ApartmentItem, ApartmentItemDialogData} from "../../domain/apartment-item";
import {ItemDialogComponent} from "../dialogs/item-dialog/item-dialog.component";
import {Header} from "../../domain/header";
import {DetailDialogComponent} from "../dialogs/detail-dialog/detail-dialog.component";
import {Widget} from "../widget/widget";
import {ChipMap} from "../../domain/chip-map";
import {ApartmentDetailIso} from "../../domain/apartment-detail-iso";
import {defaultIso} from "../../domain/countries-iso";

@Component({
    selector: 'summer',
    templateUrl: './summer.component.html',
    styleUrl: './summer.component.scss',
    imports: [
        LetDirective,
        MatCard,
        MatCardHeader,
        NgxEditorComponent,
        FormsModule,
        MatButtonToggleGroup,
        MatButtonToggle,
        MatButton,
        MatIcon,
        MatCardContent,
        CdkDropList,
        WidgetComponent,
        CdkDrag,
        TranslatePipe,
    ],
})
export class SummerComponent implements OnInit, OnDestroy {
    private store = inject(ApartmentStore);
    private dialog = inject(MatDialog);
    private translateService = inject(TranslateService);

    @HostBinding("style.--grid-col")
    gridCol: number = 1;

    @Input() set col(col: number | null) {
        if (col) {

            this.gridCol = col;
        }
    }

    @Input()
    loggedIn: boolean = false;

    @Input()
    selectedIso: string = defaultIso;

    activeDetail$ = this.store.selectedDetailPage$.pipe(filter((e) => !!e));

    header$ = this.store.header$;
    unsubscribe$ = new Subject<void>();
    local: boolean = true;
    apartment: string = "";
    editor: Editor = new Editor();


    ngOnInit() {

        // this.editor = new Editor();
    }


    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
        this.editor.destroy();
    }

    /* deleteDetail(detail: ApartmentDetail | null) {
       console.log("(click) delete Detail", detail);
       if(detail){
          this.store.deleteDetailEffect(detail);
        //  this.router.navigate(['/']);
       }
     }*/

    deleteDetail(detail: ApartmentDetail | null) {
        this.conformationDialog().pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(confirm => {
                if (confirm) {
                    if (detail) {
                        console.log("delete Detail")
                        this.store.deleteDetailEffect(detail)
                    }
                }
            }
        );
    }

    conformationDialog() {
        const dialogRef = this.dialog.open(ConformationDialogComponent, {
            width: '320px',
            data: this.translateService.instant('delete.detail')
        });
        return dialogRef.afterClosed();
    }


    createNewItem(detail: ApartmentDetail | null, colors: Colors | null | undefined) {
        console.log("(click) createItem detail", detail);

        if (detail) {
            const item: Partial<ApartmentItem> = {detailId: detail.id};
            const data: ApartmentItemDialogData = {
                languages: detail.iso.map(iso => iso.iso),
                item: item,
                colors: colors
            };

            this.openDialogItem(data).pipe(
                filter(val => !!val),
                takeUntil(this.unsubscribe$)
            ).subscribe(detailProps => {
                    console.log("props", detailProps);
                    if (detailProps.id) {
                        this.store.updateItemEffect(detailProps)
                    } else {
                        this.store.createItemEffect(detailProps)
                    }

                }
            );
        }
    }


    openDialogItem(item?: ApartmentItemDialogData) {

        const dialogRef = this.dialog.open(ItemDialogComponent, {
            width: '500px',
            data: {
                ...item
            },
        });

        return dialogRef.afterClosed();
    }


    updateDetail(header: Header | null, detail: ApartmentDetail | null) {

        const selectedLanguages: string[] | undefined = header?.languages;
        console.log("updateDetail", detail);

        const partial: Partial<ApartmentDetail> = {...detail}

        const data: ApartmentDetailDialogData = {
            languages: selectedLanguages,
            host: header?.host,
            detail: partial,
            colors: header?.colors
        }

        this.openApartmentDetailDialog(data).pipe(
            filter(val => !!val),
            takeUntil(this.unsubscribe$)
        ).subscribe(detailProps => {
                if (detailProps.id) {
                    this.store.updateApartmentDetailEffect(detailProps)
                } else {
                    this.store.createDetailEffect(detailProps)
                }
            }
        );

    }

    openApartmentDetailDialog(data?: ApartmentDetailDialogData) {

        const dialogRef = this.dialog.open(DetailDialogComponent, {
            width: '400px',
            data: {
                ...data
            },
        });
        return dialogRef.afterClosed();
    }


    onChange($event: any, detail: ApartmentDetail | null) {
        const detailUpdate: Partial<ApartmentDetail> = {...detail, columns: $event.value}
        console.log("detailUpdate ", detailUpdate);
        this.store.updateApartmentDetailEffect(detailUpdate);
        //  this.gridCol=$event.value;
    }

    drop(event: CdkDragDrop<ApartmentItem[]>): void {
        //  if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        /* } else {
           transferArrayItem(event.previousContainer.data,
             event.container.data,
             event.previousIndex,
             event.currentIndex);
         }*/
    }

    transformItemToWidget(detail: ApartmentDetail, item: ApartmentItem, colors: Colors | undefined): Widget {
        return {
            item: item,
            languages: detail.iso.map(iso => iso.iso),
            component: ChipMap.get(item.chip),
            colors: colors
        };
    }

    getTitle(country: string | null, iso: ApartmentDetailIso[] | undefined) {
        return iso?.find(iso => iso.iso === country)?.title;
    }

    onlyOne(detailLength: number | undefined) {
        if(detailLength){
            if (detailLength < 2) {
                return true;
            } else {
                return false;
            }
        }
      return true;
    }
}
