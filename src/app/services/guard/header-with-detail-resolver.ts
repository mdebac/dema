import {ResolveFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {environment} from "../../../environments/environment";
import {ApartmentStore} from "../apartments-store.service";

export const headerWithDetailResolver: ResolveFn<any> = (activatedRoute, state) => {
  const store = inject(ApartmentStore);
 // const router = inject(Router);

 // const activatedRoute = inject(ActivatedRoute);
 // const segment = activatedRoute.snapshot.url.map(segment => segment.path).join('/');
 // store.setUrlSegment(segment);

  console.log("(Header With Detail - Resolver) url location", window.location.href);

  const local = !environment.production;

  let host= window.location.host.toLowerCase();
  console.log("window location host",host);
  if(local){
    host = "adriaticsun.eu";
  }
  console.log("actual host",host);

  console.log("(header resolver with detail) param", activatedRoute.params['detail']);
  console.log("(header resolver with detail) page", host);
  if (activatedRoute.params['detail']) {
    store.patchState({activeDetailUrl: activatedRoute.params['detail']});
  }else{
    store.patchState({activeDetailUrl: null});
  }
  store.loadHeaderByHostWithDetail(host);

  return true;
};
