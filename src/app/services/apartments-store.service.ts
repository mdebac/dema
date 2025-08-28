import {inject, Injectable} from "@angular/core";
import {Apartment} from "../domain/apartment";
import {catchError, EMPTY, finalize, Observable, of, switchMap, take, tap, withLatestFrom} from "rxjs";
import {ApartmentCriteria} from "../domain/apartment-criteria";
import {ComponentStore} from '@ngrx/component-store';
import {ApiError} from "../domain/api-error";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {filter} from "rxjs/operators";
import {Router} from "@angular/router";
import {ApartmentDetail} from "../domain/apartment-detail";
import {ApartmentItem} from "../domain/apartment-item";
import {Header} from "../domain/header";
import {TranslateService} from "@ngx-translate/core";
import {Colors} from "../domain/colors";
import {ApartmentsHttpService} from "./apartments-http.service";
import {Page} from "../util/search-criteria";
import {Chip} from "../domain/chip.enum";
import {TokenService} from "./token.service";
import {ShareableService} from "./shareable.service";
import {MatTableDataSource} from "@angular/material/table";

export interface ApartmentState {
    page: Page<Apartment>;

    selectedDetailPageLabel: string | null,

    selectedIso: string | null,

    generatedUrl: string | null,
    generatedDetailedUrl: string | null,

    paginationPage: number,
    paginationSize: number,
    paginationSort: string,

    //ako nema niti apartmentUrl niti detailUrl, loadaj pr
    selectedDetailPage: ApartmentDetail | null,
    header: Header | null,
    loadHeader: boolean,
    headerLoading: boolean,

    activeDetailUrl: string | null;
    segment: string | null;
    selectedApartmentId: number | null,

    filterChip: Chip | null;
    filterTitle: string | null;

    loading: boolean;
    error: ApiError | null;
}

export const initialApartmentState: ApartmentState = {
    page: Page.empty(),

    selectedDetailPageLabel: null,
    selectedDetailPage: null,
    selectedApartmentId: null,

    generatedUrl: null,
    generatedDetailedUrl: null,

    selectedIso: null,
    loading: false,
    header: null,
    loadHeader: false,
    headerLoading: false,
    activeDetailUrl: null,
    segment: null,

    filterChip: null,
    filterTitle: null,
    paginationPage: 0,
    paginationSize: 20,
    paginationSort: 'created_on,DESC',

    error: null,
};

@Injectable()
export class ApartmentStore extends ComponentStore<ApartmentState> {
    readonly service = inject(ApartmentsHttpService);
    readonly tokenService = inject(TokenService);
    readonly router = inject(Router);
    readonly translateService = inject(TranslateService);
    readonly shareableService = inject(ShareableService);

    apartmentsPage$: Observable<Page<Apartment>> = this.select((state) => state.page);

    loading$: Observable<boolean> = this.select((state) => state.loading);
    error$: Observable<ApiError | null> = this.select((state) => state.error);
    paginationPage$: Observable<number> = this.select((state) => state.paginationPage);
    paginationSize$: Observable<number> = this.select((state) => state.paginationSize);
    paginationSort$: Observable<string> = this.select((state) => state.paginationSort);

    filterChip$: Observable<Chip | null> = this.select((state) => state.filterChip);
    filterTitle$: Observable<string | null> = this.select((state) => state.filterTitle);

    selectedDetailPage$: Observable<ApartmentDetail | null> = this.select((state) => state.selectedDetailPage);

    activeDetailUrl$: Observable<string | null> = this.select((state) => state.activeDetailUrl);

    header$: Observable<Header | null> = this.select((state) => state.header);

    loadHeader$: Observable<boolean> = this.select((state) => state.loadHeader);


    columns$: Observable<number> = this.select(
        this.selectedDetailPage$,
        (page) => {
            if (page && page.columns) {
                return page?.columns;
            } else {
                return 1;
            }
        }
    );

    colors$: Observable<Colors | null> = this.select(
        this.header$,
        (header) => {
            if (header?.colors) {
                return header.colors;
            } else return null;
        }
    );

    apartmentCriteria$: Observable<ApartmentCriteria> = this.select(
        this.filterChip$,
        this.filterTitle$,
        this.paginationPage$,
        this.paginationSize$,
        this.paginationSort$,
        (chip, title, page, size, sort) => {
            return {chip, title, page, size, sort} as ApartmentCriteria;
        }
    );

    apartmentList$: Observable<Apartment[]> = this.select(
        this.apartmentsPage$,
        (page) => {
            return page.content;
        }
    );

    apartmentCount$: Observable<number> = this.select(
        this.apartmentsPage$,
        (page) => {
            return page.content.length;
        }
    );


    /*    isHostAdriaticSun$: Observable<boolean> = this.select(
            this.header$,
            page => {
                return page?.host.toUpperCase() === Hosts.ADRIATICSUN_EU;
            }
        );

        isHostDemaApartments$: Observable<boolean> = this.select(
            this.header$,
            page => {
                return page?.host.toUpperCase() === Hosts.DEMA_APARTMENTS;
            }
        );

        isHostInfoDema$: Observable<boolean> = this.select(
            this.header$,
            page => {
                return page?.host.toUpperCase() === Hosts.INFO_DEMA_EU;
            }
        );*/

    //   this.isHostAdriaticSun = data?.host === Hosts.ADRIATICSUN_EU

    loadApartmentEffect = this.effect(
        (criteria$: Observable<ApartmentCriteria>) => criteria$.pipe(
            tap(() => this.patchState({loading: true})),
            switchMap(
                (criteria) => this.service.searchApartments(criteria)
                    .pipe(
                        tapResponse({
                            next: (response: Page<Apartment>) => this.patchState({page: response}),
                            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => this.patchState({loading: false}))
                    ),
            ),
        )
    );

    readonly loadDetailByRouteLabelsEffect = this.effect(
        (activeDetailUrl$: Observable<string | null>) => activeDetailUrl$.pipe(
            withLatestFrom(
                this.header$,
                this.loadHeader$,
            ),
            tap(([activeDetailUrl, header, loadHeader]) => {
                //  this.patchState({loading: true});
                console.log("(effect) loadDetailByRouteLabelsEffect activeDetailUrl", activeDetailUrl);
                console.log("(effect) loadDetailByRouteLabelsEffect header", header);
                console.log("(effect) loadDetailByRouteLabelsEffect loadHeader", loadHeader);
                console.log("(effect) loadDetailByRouteLabelsEffect filter", !(!!header && header?.detail.find(a => a.detailUrl !== activeDetailUrl)));

            }),
         //   filter(([activeDetailUrl, header, loadHeader]) => !(!!header && header?.detail.find(a => a.detailUrl !== activeDetailUrl))),
            tap(([activeDetailUrl, header, loadHeader]) => {
                //  this.patchState({loading: true});
                console.log("(effect) loadDetailByRouteLabelsEffect PROŠO");

            }),
            switchMap(([activeDetailUrl, header, loadHeader]) =>
                this.service.fetchDetailByRouteLabels(header, activeDetailUrl)
                    .pipe(
                        tapResponse({
                            next: (response: ApartmentDetail | null) => {
                                this.patchState({selectedDetailPage: response})
                                if (header?.host && loadHeader) {
                                    this.loadHeaderByHost(header.host);
                                    this.setLoadHeader(false);
                                }
                            },
                            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => this.patchState({loading: false}))
                    )
            ),
        )
    );

    loadHeaderByHost = this.effect(
        (host$: Observable<string>) => host$.pipe(
            filter((host) => !!host),
            switchMap((host) => this.service.fetchHeaderByHost(host)
                .pipe(
                    tapResponse({
                        next: (response: Header) => {
                            console.log("loadHeaderByHost PATCH", response);
                            this.patchState({header: response});
                            //    this.loadDetailByRouteLabelsEffect(response);
                        },
                        error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                    }),
                    catchError(() => EMPTY),
                    finalize(() => this.patchState({loading: false}))
                )
            ),
        ));

    loadMyApartmentEffect = this.effect(
        _ => _.pipe(
            withLatestFrom(
                this.header$,
            ),
            switchMap(
                ([_,header]) => this.service.myApartments(header?.host)
                    .pipe(
                        tapResponse({
                            next: (response: Page<Apartment>) => {

                                response.content.forEach(
                                    a => {
                                        a.customersDS = new MatTableDataSource(a.customers);
                                    }
                                );

                                console.log("transformed", response);

                                this.patchState({page: response})
                            },
                            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => this.patchState({loading: false}))
                    )),
        ),
    );

    readonly createApartmentEffect = this.effect(
        (apartment$: Observable<Partial<Apartment>>) => apartment$.pipe(
            withLatestFrom(
                this.header$,
            ),
            tap(([apartment, header]) => {
                console.log("(effect) createApartmentEffect", apartment);
            }),
            switchMap(
                ([apartment, header]) => this.service.createApartment(apartment)
                    .pipe(
                        tap({
                            next: (response) => {
                                // if(header?.host){
                                //     this.patchState({activeDetailUrl: null});
                                //     this.loadHeaderByHost(header.host);
                                //
                                //     this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
                                //         this.router.navigate(['']);
                                //     });
                                //
                                // }
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    readonly loadDetailByDetailIdEffect = this.effect(
        (detailId$: Observable<number>) => detailId$.pipe(
            filter((detailId) => !!detailId),
            tap(() => this.patchState({loading: true})),
            switchMap((detailId) => this.service.fetchDetailById(detailId)
                .pipe(
                    tap({
                        next: (response: ApartmentDetail) => this.patchState({selectedDetailPage: response}),
                        error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                    }),
                    catchError(() => EMPTY),
                    finalize(() => this.patchState({loading: false}))
                )
            ),
        ));

    readonly deleteDetailEffect = this.effect(
        (detail$: Observable<ApartmentDetail>) => detail$.pipe(
            withLatestFrom(
                this.header$,
            ),
            tap(([detail, header]) => console.log("(effect) delete Detail, id", detail.id)),
            switchMap(
                ([detail, header]) => this.service.deleteApartmentDetail(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                if (header?.host) {
                                    this.patchState({activeDetailUrl: null});
                                    this.loadHeaderByHost(header.host);
                                    this.router.navigate(['/']);
                                }

                                //this.router.navigate(['/']);
                                //     this.patchState({activeDetailUrl: null});
//TO FIX, load all
                                //  this.router.navigate(['/'], { queryParams: { loadHeader: true } });
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    readonly deleteItemEffect = this.effect(
        (item$: Observable<ApartmentItem>) => item$.pipe(
            tap((item) => console.log("(effect) delete Item, id", item.id)),
            switchMap(
                (item) => this.service.deleteItem(item)
                    .pipe(
                        tap({
                            next: (response) => {
                                this.loadDetailByDetailIdEffect(item.detailId);
                                //notification window, item deleted
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    readonly createItemEffect = this.effect(
        (detail$: Observable<Partial<ApartmentItem>>) => detail$.pipe(
            tap(() => console.log("(effect) create Item")),
            switchMap(
                (detail) => this.service.createItem(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                this.loadDetailByDetailIdEffect(response.detailId);
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    readonly updateItemEffect = this.effect(
        (detail$: Observable<Partial<ApartmentItem>>) => detail$.pipe(
            tap(() => console.log("(effect) update Item")),
            switchMap(
                (detail) => this.service.updateItem(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                this.loadDetailByDetailIdEffect(response.detailId);
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));


    readonly createDetailEffect = this.effect(
        (detail$: Observable<Partial<ApartmentDetail>>) => detail$.pipe(
            tap(() => console.log("(effect) create Detail")),
            switchMap(
                (detail) => this.service.createApartmentDetail(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                //this.router.navigate([response.titleUrl]);
                                console.log("set new active detail", response.titleUrl);
                                //  this.patchState({activeDetailUrl: response.titleUrl});
                                this.router.navigate([response.titleUrl], {queryParams: {loadHeader: true}});
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));


    readonly updateApartmentDetailEffect = this.effect(
        (detail$: Observable<Partial<ApartmentDetail>>) => detail$.pipe(
            tap(() => console.log("(effect) update Detail")),
            withLatestFrom(
                this.activeDetailUrl$
            ),
            switchMap(
                ([detail, active]) => this.service.updateApartmentDetail(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                if (active === response.titleUrl) {
                                    // this.patchState({selectedDetailPage: response});
                                    // this.patchState({activeDetailUrl: response.titleUrl});
                                    //this.router.navigate([response.titleUrl]);
                                    this.loadDetailByRouteLabelsEffect(response.titleUrl);
                                } else {
                                    this.router.navigate([response.titleUrl], {queryParams: {loadHeader: true}});
                                }
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));


    readonly deleteApartmentByIdEffect = this.effect(
        (id$: Observable<number>) =>
            id$.pipe(
                switchMap((id) => this.service.deleteApartment(id).pipe(
                    tap({
                        next: (response) => this.loadMyApartmentEffect(),
                        error: (error) => this.patchState({error: error.error}),
                    }),
                    catchError(() => EMPTY),
                    finalize(() => {
                        },
                    )),
                ))
    );


    setHeader(header: Header) {
        console.log("Header je setan", header);
        this.patchState({header: header});
    }

    setLoadHeader(load: boolean) {
        console.log("LoadHeader je setan", load);
        this.patchState({loadHeader: load});
    }

    selectIso(country: string) {
        console.log("ISO selected", country);
        this.patchState({selectedIso: country});
        this.translateService.use(country);
    }

    loadApartments(chip: Chip | null = null,
                   title: string | null = null,
                   sortDirection: string = 'asc',
                   pageIndex: number = 0,
                   pageSize: number = 20) {

        console.log("-------------loadApartments");
        console.log("chip", chip);
        console.log("title", title);
        console.log("sortDirection", sortDirection);
        console.log("pageIndex", pageIndex);
        console.log("pageSize", pageSize);

        this.patchState({
            filterChip: chip,
            filterTitle: title,
            paginationPage: pageIndex,
            paginationSize: pageSize,
            paginationSort: sortDirection,
        });
    }

    setPage(label: string) {
        console.log("PAGE JE SETTAN trigger now")
        this.patchState({
            activeDetailUrl: label
            //     selectedDetailPageLabel: label
        });
    }

    setDetail(detail: string) {
        console.log("activeDetailUrl JE SETTAN trigger now")
        this.patchState({activeDetailUrl: detail});
    }

    constructor() {
        console.log("CONSTRUCTOR STORE");
        super(initialApartmentState);
    }
}
