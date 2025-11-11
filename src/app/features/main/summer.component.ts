import {Component, ElementRef, HostBinding, inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {Subject} from "rxjs";
import {Editor, NgxEditorComponent} from "ngx-editor";
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WidgetComponent} from "../widget/widget.component";
import {Colors} from "../../domain/colors";
import {ApartmentDetail} from "../../domain/apartment-detail";
import {ApartmentItem} from "../../domain/apartment-item";
import {Header} from "../../domain/header";
import {Widget} from "../widget/widget";
import {ChipMap} from "../../domain/chip-map";
import {ApartmentDetailIso} from "../../domain/apartment-detail-iso";
import {defaultIso} from "../../domain/countries-iso";
import {Side} from "../../domain/side";
import {Layout} from "../../domain/layout";
import {LayoutState} from "../../domain/layout-state";
import {AuthStore} from "../../services/authentication/auth-store";
import {Hosts} from "../../domain/hosts";
import {Roles} from "../../domain/roles";
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {PageActionsComponent} from "../menus/page-actions/page-actions.component";
import {TranslatePipe} from "@ngx-translate/core";
import {HeaderActionsComponent} from "../menus/header-actions/header-actions.component";
import {Router, RouterLink} from "@angular/router";

@Component({
    selector: 'summer',
    templateUrl: './summer.component.html',
    styleUrl: './summer.component.scss',
    imports: [
        MatCard,
        MatCardHeader,
        NgxEditorComponent,
        FormsModule,
        MatCardContent,
        CdkDropList,
        WidgetComponent,
        CdkDrag,
        MatButton,
        MatIcon,
        MatMenu,
        MatMenuTrigger,
        PageActionsComponent,
        TranslatePipe,
        HeaderActionsComponent,
        ReactiveFormsModule,
        RouterLink,
    ],
})
export class SummerComponent implements OnInit, OnDestroy {

    private authStore = inject(AuthStore);
    private router = inject(Router);

    @Input() activeDetail: ApartmentDetail | null = null;
    @Input() header: Header | null = null;

    @HostBinding("style.--grid-col")
    cssGridCol: number = 1;

    @HostBinding("style.--right-padding")
    cssRightPadding: any = "0";

    @HostBinding("style.--left-padding")
    cssLeftPadding: any = "0";

    @HostBinding("style.--corner-radius")
    cssCornerRadius: string = "16px";

    @Input()
    @HostBinding("style.--background-color")
    backgroundColor: string = "";

    @HostBinding("style.--bg-color-menu")
    bgColorMenu: string = "";

    @HostBinding("style.--color-menu")
    colorMenu: string = "";


    @Input()
    @HostBinding("style.--actions-border-color")
    actionsBorderColor: string = "";

    @Input()
    isMobile: boolean = false;

    @Input() set cornerRadius(cornerRadius: number | null) {
        if (cornerRadius) {
            this.cssCornerRadius = cornerRadius + "px";
        }
    }

    @Input() set stateLayout(stateLayout: LayoutState | undefined) {
        if (stateLayout) {
            if (stateLayout?.gapL === 0 && stateLayout?.menuL === 0) {
                this.cssLeftPadding = "10px";
            } else {
                this.cssLeftPadding = "0";
                if (stateLayout.panelL !== 0) {
                    this.cssLeftPadding = "10px";
                }
            }

            if (stateLayout?.gapR === 0 && stateLayout?.menuR === 0) {
                this.cssRightPadding = "10px";
            } else {
                this.cssRightPadding = "0";
                if (stateLayout.panelR !== 0) {
                    this.cssRightPadding = "10px";
                }
            }
        }
    }

    isAdmin(){
        return this.authStore.authorize(Roles.ADMIN);
    }
    isManager(){
        return this.authStore.authorize(Roles.MANAGER);
    }

    @Input() set col(col: number | null) {
        if (col) {
            this.cssGridCol = col;
        }
    }

    @Input()
    loggedIn: boolean = false;

    //canEditItems

    @Input()
    selectedIso: string | null = defaultIso;

    unsubscribe$ = new Subject<void>();
    local: boolean = true;
    apartment: string = "";
    editor: Editor = new Editor();
    hideContent: boolean = false;

    constructor() {
        console.log("SUMMER load");
    }

    ngOnInit() {
        this.colorMenu = this.header?.colors.primaryColor ? this.header?.colors.primaryColor : "";
        this.bgColorMenu = this.header?.colors.secondaryColor ? this.header?.colors.secondaryColor : "";
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
        this.editor.destroy();
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

    transformItemToWidget(detail: ApartmentDetail, item: ApartmentItem, colors: Colors | undefined, host: Hosts | undefined, isMobile: boolean): Widget {

        if(isMobile){
            item = {...item, colSpan: 1, rowSpan: 1};
        }

        return {
            item: item,
            languages: detail.iso.map(iso => iso.iso),
            component: ChipMap.get(item.chip),
            colors: colors,
            host: host
        };
    }

    getTitle(country: string | null, iso: ApartmentDetailIso[] | undefined) {
        return iso?.find(iso => iso.iso === country)?.title;
    }

    menuContainerClick(){
        this.hideContent = !this.hideContent;
        if(this.hideContent){
            this.colorMenu = this.header?.colors.secondaryColor ? this.header?.colors.secondaryColor : "";
            this.bgColorMenu = this.header?.colors.primaryColor ? this.header?.colors.primaryColor : "";
        }
        if(!this.hideContent){
            this.bgColorMenu = this.header?.colors.secondaryColor ? this.header?.colors.secondaryColor : "";
            this.colorMenu = this.header?.colors.primaryColor ? this.header?.colors.primaryColor : "";
        }
    }


    @ViewChild('menuContainer', { static: false }) menuContainer: ElementRef | undefined;
    goTo(menuUrl: string | undefined, panelUrl: string) {
        // console.log("goTo", menuUrl, panelUrl);
        this.hideContent = false;
        this.bgColorMenu = this.header?.colors.secondaryColor ? this.header?.colors.secondaryColor : "";
        this.colorMenu = this.header?.colors.primaryColor ? this.header?.colors.primaryColor : "";

        this.menuContainer?.nativeElement.scrollIntoView();
        this.router.navigate([menuUrl, panelUrl]);
    }

    protected readonly Side = Side;
    protected readonly Layout = Layout;
}
