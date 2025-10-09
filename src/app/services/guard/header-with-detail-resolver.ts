import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {ApartmentStore} from "../apartments-store.service";

export const headerWithDetailResolver: ResolveFn<any> = (activatedRoute, state) => {
    const store = inject(ApartmentStore);
    console.log("(header resolver) menu", activatedRoute.params['menu']);
    console.log("(header resolver) panel", activatedRoute.params['panel']);
    if (activatedRoute.params['menu']) {
        console.log("(header resolver) set Active Menu And Panel");
        store.setActiveMenuAndPanel(activatedRoute.params['menu'], activatedRoute.params['panel'])
    }
    return true;
};
