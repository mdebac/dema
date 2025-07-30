import {ActivatedRouteSnapshot, CanActivateFn, Resolve, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {ApartmentsHttpService} from "../apartments-http.service";
import {Observable} from "rxjs";
import {Header} from "../../domain/header";

Injectable({
  providedIn: 'root',
})
export class headerResolver implements Resolve<Header> {
  service = inject(ApartmentsHttpService);

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

    const local = !environment.production;

    let host = window.location.host.toLowerCase();
    console.log("window location host", host);
    if (local) {
      host = "adriaticsun.eu";
    }
    console.log("actual host", host);

    return this.service.fetchHeaderByHost(host);
  }

}
/*
export const headerResolver: ResolveFn<Observable<Headers>> = () => {
  const shareableService = inject(ShareableService);
  const service = inject(ApartmentsHttpService);
  // const activatedRoute = inject(ActivatedRoute);
  // const segment = activatedRoute.snapshot.url.map(segment => segment.path).join('/');
  //store.setUrlSegment(segment);
  //
  // const segment = activatedRoute.snapshot.url.map(segment => segment.path).join('/');

  const local = !environment.production;

  let host = window.location.host.toLowerCase();
  console.log("window location host", host);
  if (local) {
    host = "adriaticsun.eu";
  }
  console.log("actual host", host);

  shareableService.setActiveDetailUrl(null);

  service.fetchHeaderByHost(host).subscribe(
      header => {
        shareableService.setHeader(header);
        console.log("headerResolver setHeader", host);
      }
  );

  //service.fetchHeaderByHost(host);

 // store.patchState({activeDetailUrl: null});
 // store.loadHeaderByHost(host);

  return service.fetchHeaderByHost(host);
};
*/