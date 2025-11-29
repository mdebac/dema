import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {inject, Injectable} from '@angular/core';
import {ApartmentsHttpService} from "../apartments-http.service";
import {Observable} from "rxjs";
import {Header} from "../../domain/header";

Injectable({
  providedIn: 'root',
})
export class headerResolver implements Resolve<Header> {
  service = inject(ApartmentsHttpService);

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.service.fetchHeader();
  }
}
