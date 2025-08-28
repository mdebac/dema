import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {ApartmentStore} from "../apartments-store.service";

export const headerWithDetailResolver: ResolveFn<any> = (activatedRoute, state) => {
    const store = inject(ApartmentStore);
    console.log("(header resolver with detail) param", activatedRoute.params['detail']);

    if (activatedRoute.params['detail']) {
        console.log("headerWithDetailResolver set activeDetailUrl activatedRoute", activatedRoute)

        if (activatedRoute.queryParams['loadHeader']) {
            store.setLoadHeader(true);
        } else {
            store.setLoadHeader(false);
        }

        store.setDetail(activatedRoute.params['detail'])
    }

    return true;
};
