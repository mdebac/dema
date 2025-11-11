import {Component, HostBinding, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {filter, map, takeUntil} from "rxjs/operators";
import {defaultIso} from "../../domain/countries-iso";
import {ApartmentIso} from "../../domain/apartment-iso";
import {ActivatedRoute, Data, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {LetDirective} from '@ngrx/component';
import {NgIf} from '@angular/common';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ApartmentStore} from "../../services/apartments-store.service";
import {IsoButtonsComponent} from "../iso-buttons/iso-buttons.component";
import {Roles} from "../../domain/roles";
import {Hosts} from "../../domain/hosts";
import {AuthStore} from "../../services/authentication/auth-store";
import {UserButtonsComponent} from "../user-buttons/user-buttons.component";
import {ApartmentDetail, ApartmentDetailDialogData} from "../../domain/apartment-detail";
import {Colors} from "../../domain/colors";
import {DetailDialogComponent} from "../dialogs/detail-dialog/detail-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Header} from "../../domain/header";
import {Title} from "@angular/platform-browser";
import {Menu} from "../../domain/menu";
import {Panel} from "../../domain/panel";
import {Link} from "../../domain/link";
import {TranslateService} from "@ngx-translate/core";
import {MainConfComponent} from "./main-conf/main-conf.component";
import {MobileTopMenuComponent} from "../mobile-menu/mobile-top-menu.component";
import {TopMenuComponent} from "../top-menu/top-menu.component";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";

@Component({
    selector: 'start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    imports: [UserButtonsComponent, LetDirective, NgIf, MatFabButton, RouterLinkActive, RouterLink, MatIcon, IsoButtonsComponent, RouterOutlet, MatIconButton, MainConfComponent, MatButton, MobileTopMenuComponent, TopMenuComponent, MatMenu, MatMenuTrigger],
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
        if(window.innerWidth < 600){
            this.titleSize = "1.2rem";
            this.store.setMobileView(true);
        }else{
            this.store.setMobileView(false);
            this.titleSize = "4.2rem";
        }
    }

    ngOnInit() {
        console.log("StartComponent ngOnInit")
        this.user$ = this.authStore.user$;
        this.isLoggedIn$ = this.authStore.isLoggedIn$;

        this.browserLang = this.translateService.getBrowserLang();

        console.log("this.browserLang", this.browserLang);
        if (this.browserLang) {
            if (this.browserLang.includes('en')) {
                this.store.selectIso(defaultIso);
            } else {
                this.store.selectIso(this.browserLang.toUpperCase());
            }
        } else {
            this.store.selectIso(defaultIso);
        }

        this.activatedRoute.data.pipe(map((data: Data) => data['myData'])).subscribe(
            data => {
                const title = data.iso.find((s: { iso: string; }) => s.iso === defaultIso).title;
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

    getIconTitle(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.title;
        } else return "";
    }

    getDescriptionText(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.description;
        } else return "";
    }


    protected readonly Roles = Roles;
}


/*

isTokenValid() {
  const token = this.token;
  if (!token) {
    return false;
  }
  // decode the token
  const jwtHelper = new JwtHelperService();
  // check expiry date
  const isTokenExpired = jwtHelper.isTokenExpired(token);
  if (isTokenExpired) {
    localStorage.clear();
    return false;
  }
  return true;
}

isTokenNotValid() {
  return !this.isTokenValid();
}

get userRoles(): string[] {
 */

