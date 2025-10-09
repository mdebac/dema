import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject} from "rxjs";
import {filter, map, takeUntil} from "rxjs/operators";
import {defaultIso} from "../../domain/countries-iso";
import {ApartmentIso} from "../../domain/apartment-iso";
import {ActivatedRoute, Data, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {LetDirective} from '@ngrx/component';
import {NgIf} from '@angular/common';
import {MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ApartmentStore} from "../../services/apartments-store.service";
import {IsoButtonsComponent} from "../iso-buttons/iso-buttons.component";
import {ShareableService} from "../../services/shareable.service";
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
//import {routeTransition} from "../../animations/route-transition";
import {Link} from "../../domain/link";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    imports: [UserButtonsComponent, LetDirective, NgIf, MatFabButton, RouterLinkActive, RouterLink, MatIcon, IsoButtonsComponent, RouterOutlet, MatIconButton],
    // animations: [
    //     routeTransition
    // ]
})
export class StartComponent implements OnInit, OnDestroy {

    readonly store = inject(ApartmentStore);
    readonly shareableService = inject(ShareableService);
    readonly activatedRoute = inject(ActivatedRoute);
    readonly authStore = inject(AuthStore);
    readonly dialog = inject(MatDialog);
    readonly router = inject(Router);
    readonly titleService = inject(Title);
    readonly translateService = inject(TranslateService);
    // notificationService = inject(NotificationService);
    // errorService = inject(ErrorService);

    unsubscribe$ = new Subject<void>();
    //error$ = this.store.error$.pipe(filter((e) => !!e));

    // header$ = this.shareableService.getHeader();
    //selectedIso$ = this.shareableService.getSelectedIso();
    selectedIso$ = this.store.selectedIso$;
    role$ = this.authStore.roles$;
    //segment$ = this.store.segment$;
   // segment$ = this.shareableService.getSegment();
    loggedIn: boolean = true;

    isLoggedIn$: Observable<boolean> | undefined;
    user$ = this.authStore.user$;

    isHostAdriaticSun: boolean = false;

    header$ = this.store.header$;

    menuSide$ = this.store.side$;

    browserLang: string | undefined = '';
    //TODO
    protected breadcrumbs: Link[] = [
        {
            label: 'About Us',
            path: '/about'
        }
    ]

    ngOnInit() {
        console.log("StartComponent ngOnInit")
        this.user$ = this.authStore.user$;
        this.isLoggedIn$ = this.authStore.isLoggedIn$;

        this.browserLang = this.translateService.getBrowserLang();

        console.log("this.browserLang", this.browserLang);
        if(this.browserLang){
            if(this.browserLang === 'en'){
                this.store.selectIso(defaultIso);
            }
            else {
                this.store.selectIso(this.browserLang.toUpperCase());
                this.shareableService.setSelectedIso(this.browserLang);
            }
        }else {
            this.store.selectIso(defaultIso);
        }

        this.activatedRoute.data.pipe(map((data: Data) => data['myData'])).subscribe(
            data => {
                const title= data.iso.find((s: { iso: string; })=>s.iso===defaultIso).title;
                this.titleService.setTitle(title);
                this.store.setHeader(data);
                this.store.loadDetailByRouteLabelsEffect(this.store.activeMenu$);
                console.log("StartComponent data set Header into store", data);

               //TODO this.setFavIcon("");

                this.isHostAdriaticSun = data?.host === Hosts.ADRIATICSUN_EU

                const variables = [
                    '--primary-color: ' + data.colors.primaryColor + ';',
                    '--secondary-color: ' + data.colors.secondaryColor + ';',
                    '--danger-color: ' + data.colors.dangerColor + ';',
                    '--warn-color: ' + data.colors.warnColor + ';',
                    '--info-color: ' + data.colors.infoColor + ';',
                    '--accept-color: ' + data.colors.acceptColor + ';',
                    '--myImageUrl: linear-gradient(to left, transparent, '+ data.colors.secondaryColor +' ' + data.linearPercentage +'%),url(data:image/jpg;base64,' + data.backgroundImage +')' + ';',
                ];
                const cssVariables = `:root{ ${variables.join('')}}`;
                const blob = new Blob([cssVariables]);
                const url = URL.createObjectURL(blob);
                const cssElement = document.createElement('link');
                cssElement.setAttribute('rel', 'stylesheet');
                cssElement.setAttribute('type', 'text/css');
                cssElement.setAttribute('href', url);
                document.head.appendChild(cssElement);

               // console.log("navigate", data.activeDetailUrl);
              //  this.router.navigate([data.activeDetailUrl]);
            }

        )
        // this.segment$.subscribe(
        //   s => {
        //     console.log("segment", s);
        //   }
        // );
        //this.shareableService.setHeader(he);
        // this.headerData = this.activatedRoute.data.pipe(map((data: Data) =>  data['myData']));

        // this.loggedIn = this.tokenService.isTokenValid();
        // console.log("loggedIn", this.loggedIn);
        // console.log("roles", this.tokenService.userRoles);

        //   this.store.selectIso(defaultIso);
        //TODO set default iso from browser
        this.shareableService.setSelectedIso(defaultIso);
        //  this.store.loadMyApartmentEffect();
        // this.error$.pipe(takeUntil(this.unsubscribe$)).subscribe((error) => {
        //   console.log("ERROR StartComponent");
        //  this.notificationService.error("error");
        //  this.errorService.constructGrowlFromApiError(error);
        //  });

    }


    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
        // this.breadcrumbs.removeItem('apartmants')
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

    createMenuDetail(header: Header | null) {
        if(header){

            const max= header.menus.reduce((acc, val) => {
                return acc.orderNum > val.orderNum ? acc : val;
            });

            const panel: Partial<Panel> = {};
            const menu: Partial<Menu> = {mainId: header.id, orderNum: max.orderNum + 1};

            const detail: Partial<ApartmentDetail> = {menu: menu, panel: panel};
            const color: Partial<Colors> = {
                primaryColor: header.colors.primaryColor,
                secondaryColor: header.colors.secondaryColor,
            };

            const data: ApartmentDetailDialogData = {
                languages: header.iso.map(iso => iso.iso),
                detail: detail,
                colors: color,
            };

            this.openApartmentDetailDialog(data).pipe(
                filter(val => !!val),
                takeUntil(this.unsubscribe$)
            ).subscribe(detailProps =>

                this.store.createDetailEffect(detailProps)

            );
        }
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


    setFavIcon(branding: string) {
        const faviconElement = document.querySelector<HTMLLinkElement>('link[rel*="icon"]');

        console.log("faviconElement", faviconElement);

    /*    if (!this.faviconElement) {
            this.faviconElement = document.createElement('link');
            this.faviconElement.rel = 'icon';
            document.head.appendChild(this.faviconElement);
        }*/
        // @ts-ignore
        faviconElement.href = "/assets/dubrovnik1.png";
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

