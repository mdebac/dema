import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject} from "rxjs";
import {filter, map, takeUntil} from "rxjs/operators";
import {defaultIso} from "../../domain/countries-iso";
import {ApartmentIso} from "../../domain/apartment-iso";
import {ActivatedRoute, Data, Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {LetDirective} from '@ngrx/component';
import {NgIf} from '@angular/common';
import {MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {ApartmentStore} from "../../services/apartments-store.service";
import {IsoButtonsComponent} from "../iso-buttons/iso-buttons.component";
import {CalendarComponent} from "../calendar/calendar.component";
import {ReklameComponent} from "../reklame/reklame.component";
import {ShareableService} from "../../services/shareable.service";
import {Roles} from "../../domain/roles";
import {Hosts} from "../../domain/hosts";
import {AuthStore} from "../../services/authentication/auth-store";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {UserButtonsComponent} from "../user-buttons/user-buttons.component";

@Component({
    selector: 'start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    imports: [UserButtonsComponent,TranslatePipe, LetDirective, NgIf, MatFabButton, RouterLinkActive, RouterLink, MatIcon, IsoButtonsComponent, MatGridList, MatGridTile, RouterOutlet, CalendarComponent, ReklameComponent]
})
export class StartComponent implements OnInit, OnDestroy {

    store = inject(ApartmentStore);
    shareableService = inject(ShareableService);
    activatedRoute = inject(ActivatedRoute);
    authStore = inject(AuthStore);
    readonly router = inject(Router);
    // notificationService = inject(NotificationService);
    // errorService = inject(ErrorService);

    unsubscribe$ = new Subject<void>();
    //error$ = this.store.error$.pipe(filter((e) => !!e));

    // header$ = this.shareableService.getHeader();
    selectedIso$ = this.shareableService.getSelectedIso();
    //selectedIso$ = this.store.selectedIso$;
    role$ = this.authStore.roles$;
    //segment$ = this.store.segment$;
   // segment$ = this.shareableService.getSegment();
    loggedIn: boolean = true;

    isLoggedIn$: Observable<boolean> | undefined;
    user$ = this.authStore.user$;

    isHostAdriaticSun: boolean = false;
    isManager = this.authStore.authorize(Roles.MANAGER);
    isAdmin = this.authStore.authorize(Roles.ADMIN);

    header$ = this.store.header$;

    ngOnInit() {
        console.log("StartComponent ngOnInit")
        this.user$ = this.authStore.user$;
        this.isLoggedIn$ = this.authStore.isLoggedIn$;

        this.store.selectIso(defaultIso);

        this.activatedRoute.data.pipe(map((data: Data) => data['myData'])).subscribe(
            data => {

                this.store.setHeader(data);
                this.store.loadDetailByRouteLabelsEffect(this.store.activeDetailUrl$);
                console.log("StartComponent data set Header into store", data);
               // this.store.setPage(data.activeDetailUrl);

                /*
                if (response.detail.length > 0) {
                                this.loadDetailByRouteLabelsEffect(response);
                            }
                 */
               // this.header = data;
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
        this.shareableService.setSelectedIso(active);
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
    protected readonly Hosts = Hosts;
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
