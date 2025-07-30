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
import {Header} from "../../domain/header";
import {AuthStore} from "../../services/authentication/auth-store";

@Component({
    selector: 'start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    imports: [LetDirective, NgIf, MatFabButton, RouterLinkActive, RouterLink, MatIcon, IsoButtonsComponent, MatGridList, MatGridTile, RouterOutlet, CalendarComponent, ReklameComponent]
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
    role$ = of(Roles.ADMIN);
    //segment$ = this.store.segment$;
    segment$ = this.shareableService.getSegment();
    loggedIn: boolean = true;

    header: Header | null = null;

    ngOnInit() {
        console.log("StartComponent ngOnInit")

        this.activatedRoute.data.pipe(map((data: Data) => data['myData'])).subscribe(
            data => {
           //     console.log("StartComponent data", data);
                this.store.setHeader(data);
                this.header = data;
                const variables = [
                    '--primary-color: ' + data.colors.primaryColor + ';',
                    '--secondary-color: ' + data.colors.secondaryColor + ';',
                    '--danger-color: ' + data.colors.dangerColor + ';',
                    '--warn-color: ' + data.colors.warnColor + ';',
                    '--info-color: ' + data.colors.infoColor + ';',
                    '--accept-color: ' + data.colors.acceptColor + ';',
                ];
                const cssVariables = `:root{ ${variables.join('')}}`;
                const blob = new Blob([cssVariables]);
                const url = URL.createObjectURL(blob);
                const cssElement = document.createElement('link');
                cssElement.setAttribute('rel', 'stylesheet');
                cssElement.setAttribute('type', 'text/css');
                cssElement.setAttribute('href', url);
                document.head.appendChild(cssElement);
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

    logout() {
     //   localStorage.removeItem('token');
        this.authStore.logout();
      //  window.location.reload();
    }

    getIconText(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.iconText;
        } else return "";
    }

    getIconTitle(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.iconTitle;
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
