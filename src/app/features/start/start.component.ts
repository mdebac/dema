import {Component, HostBinding, HostListener, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {defaultIso} from "../../domain/countries-iso";
import {ApartmentIso} from "../../domain/apartment-iso";
import {ActivatedRoute, Data, Router, RouterOutlet} from "@angular/router";
import {LetDirective} from '@ngrx/component';
import {ApartmentStore} from "../../services/apartments-store.service";
import {IsoButtonsComponent} from "../iso-buttons/iso-buttons.component";
import {Roles} from "../../domain/roles";
import {Hosts} from "../../domain/hosts";
import {AuthStore} from "../../services/authentication/auth-store";
import {UserButtonsComponent} from "../user-buttons/user-buttons.component";
import {MatDialog} from "@angular/material/dialog";
import {Title} from "@angular/platform-browser";
import {Link} from "../../domain/link";
import {TranslateService} from "@ngx-translate/core";
import {MainConfComponent} from "./main-conf/main-conf.component";
import {MobileTopMenuComponent} from "../mobile-menu/mobile-top-menu.component";
import {TopMenuComponent} from "../top-menu/top-menu.component";
import {QuillViewComponent} from "ngx-quill";
import {NgClass} from "@angular/common";

@Component({
    selector: 'start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [UserButtonsComponent, LetDirective, IsoButtonsComponent, RouterOutlet, MainConfComponent, MobileTopMenuComponent, TopMenuComponent, QuillViewComponent, NgClass],
})
export class StartComponent implements OnInit, OnDestroy {

    readonly store = inject(ApartmentStore);
    readonly activatedRoute = inject(ActivatedRoute);
    readonly authStore = inject(AuthStore);
    readonly dialog = inject(MatDialog);
    readonly router = inject(Router);
    readonly titleService = inject(Title);
    readonly translateService = inject(TranslateService);

    unsubscribe$ = new Subject<void>();
    selectedIso$ = this.store.selectedIso$;
    role$ = this.authStore.roles$;
    loggedIn: boolean = true;
    isLoggedIn$: Observable<boolean> | undefined;
    user$ = this.authStore.user$;
    isHostAdriaticSun: boolean = false;
    header$ = this.store.header$;
    menuSide$ = this.store.side$;
    isMobile$ = this.store.isMobile$;
    browserLang: string | undefined = '';
    //TODO
    protected breadcrumbs: Link[] = [
        {
            label: 'About Us',
            path: '/about'
        }
    ]

    @HostBinding("style.--title-size")
    titleSize: string = "4.2rem";

    @HostListener('window:resize')
    onResize(){
       // console.log("resize", window.innerWidth);
        if(window.innerWidth < 600){
            this.titleSize = "1.2rem";
            this.store.setMobileView(true);
        }else{
            this.store.setMobileView(false);
            this.titleSize = "4.2rem";
        }
    }

    ngOnInit() {
        console.log("StartComponent ngOnInit");
      //  console.log("ngOnInit size", window.innerWidth);
        if(window.innerWidth < 600){
            this.titleSize = "1.2rem";
            this.store.setMobileView(true);
        }else{
            this.store.setMobileView(false);
            this.titleSize = "4.2rem";
        }
        this.user$ = this.authStore.user$;
        this.isLoggedIn$ = this.authStore.isLoggedIn$;
        this.browserLang = this.translateService.getBrowserLang();
        this.activatedRoute.data.pipe(map((data: Data) => data['myData'])).subscribe(
            data => {
                const title = data.menus[0].menuUrl.includes("_") ? data.menus[0].menuUrl.substring(0, data.menus[0].menuUrl.indexOf("_")) : data.menus[0].menuUrl;
                if(this.browserLang) {
                    if (this.browserLang.includes('en')) {
                        this.store.selectIso(defaultIso);
                    }else{
                        const isHave = data?.main.languages.filter((l: { iso: string | undefined; })=>l.iso === this.browserLang?.toUpperCase());
                        if(isHave.length === 1){
                            this.store.selectIso(this.browserLang.toUpperCase());
                        }else{
                            this.store.selectIso(defaultIso);
                        }
                    }
                }

                this.titleService.setTitle(title);
                this.store.setHeader(data);
                this.store.loadDetailByRouteLabelsEffect(this.store.activeMenu$);
                this.isHostAdriaticSun = data?.host === Hosts.ADRIATICSUN_EU;
            }
        )
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
        // this.breadcrumbs.removeItem('')
    }

    toHome() {
        this.router.navigate(['/']);
    }

    activeIso(active: string) {
        this.store.selectIso(active);
    }

    getIconText(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.iconText;
        } else return "";
    }

    getTitle(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.title;
        } else return "";
    }

    getDescription(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.description;
        } else return "";
    }


    getTitleAndDescription(country: string | null, iso: ApartmentIso[] | undefined) {

        const title = this.getTitle(country,iso);
        const description = this.getDescription(country,iso);

        let output: string = "";
        if (title) {
            output = output + title;
        }
        if (description) {
            output = output + description;
        }
        return output;
    }


    protected readonly Roles = Roles;
}

