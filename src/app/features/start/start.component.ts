import {ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {filter, takeUntil} from "rxjs/operators";
import {defaultIso} from "../../domain/countries-iso";
import {ApartmentIso} from "../../domain/apartment-iso";
import { Router, RouterLinkActive, RouterLink, RouterOutlet } from "@angular/router";
import { LetDirective } from '@ngrx/component';
import { NgIf } from '@angular/common';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import {ApartmentStore} from "../../services/apartments-store.service";
import {IsoButtonsComponent} from "../iso-buttons/iso-buttons.component";
import {CalendarComponent} from "../calendar/calendar.component";
import {ReklameComponent} from "../reklame/reklame.component";

@Component({
    selector: 'start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LetDirective, NgIf, MatFabButton, RouterLinkActive, RouterLink, MatIcon, IsoButtonsComponent, MatGridList, MatGridTile, RouterOutlet, CalendarComponent, ReklameComponent]
})
export class StartComponent implements OnInit, OnDestroy {
  store = inject(ApartmentStore);
 // tokenService = inject(TokenService);
  readonly router = inject(Router);
 // notificationService = inject(NotificationService);
 // errorService = inject(ErrorService);

  unsubscribe$ = new Subject<void>();
  error$ = this.store.error$.pipe(filter((e) => !!e));

  header$ = this.store.header$;
  selectedIso$ = this.store.selectedIso$;
  tabs$ = this.store.selectedIso$;
  segment$ = this.store.segment$;

  loggedIn: boolean = true;
  roles: string[] = [];

  ngOnInit() {
    // this.segment$.subscribe(
    //   s => {
    //     console.log("segment", s);
    //   }
    // );

    // this.loggedIn = this.tokenService.isTokenValid();
    // console.log("loggedIn", this.loggedIn);
    // console.log("roles", this.tokenService.userRoles);

     this.store.selectIso(defaultIso);

      //  this.store.loadMyApartmentEffect();
    this.error$.pipe(takeUntil(this.unsubscribe$)).subscribe((error) => {
      console.log("ERROR StartComponent");
      //  this.notificationService.error("error");
      //  this.errorService.constructGrowlFromApiError(error);
    });

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

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
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
