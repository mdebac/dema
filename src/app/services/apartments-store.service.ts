import {inject, Injectable} from "@angular/core";
import {Apartment} from "../domain/apartment";
import {catchError, EMPTY, finalize, Observable, of, switchMap, take, tap, withLatestFrom} from "rxjs";
import {ApartmentCriteria} from "../domain/apartment-criteria";
import {ComponentStore} from '@ngrx/component-store';
import {ApiError} from "../domain/api-error";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {filter} from "rxjs/operators";
//import {TokenService} from "../../../services/token/token.service";
import {Router} from "@angular/router";
import {ApartmentDetail} from "../domain/apartment-detail";
import {Message} from "../domain/message";
import {ApartmentItem} from "../domain/apartment-item";
import {Header} from "../domain/header";
import {TranslateService} from "@ngx-translate/core";
import {Colors} from "../domain/colors";
import {ApartmentsHttpService} from "./apartments-http.service";
import {Page} from "../util/search-criteria";
import {Chip} from "../domain/chip.enum";
import {TokenService} from "./token.service";
import {ShareableService} from "./shareable.service";

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

  generatedUrl$: Observable<string | null> = this.select((state) => state.generatedUrl);
  generatedDetailedUrl$: Observable<string | null> = this.select((state) => state.generatedDetailedUrl);
  segment$: Observable<string | null> = this.select((state) => state.segment);

    header$: Observable<Header | null> = this.select((state) => state.header);

  selectedIso$: Observable<string | null> = this.select((state) => state.selectedIso);

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

  // @ts-ignore
 /*header$: Observable<Header> = this.select((state) => {
      console.log("TRIGGER HEADER", state.header);
    if (state.header) {
      return state.header
    }
  });*/

  colors$: Observable<Colors | null> = this.select(
    this.header$,
    (header) => {
      //  console.log("TRIGGER COLORS", header?.colors);
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
    (header$: Observable<Header | null>) => header$.pipe(
      withLatestFrom(
        this.activeDetailUrl$
      ),
      filter(([header, activeDetailUrl]) => !!header && !!header?.apartmentUrl),
      tap(([header, activeDetailUrl]) => {
        this.patchState({loading: true});
        console.log("(effect) loadDetailByRouteLabelsEffect activeDetailUrl", activeDetailUrl)
      }),
      switchMap(([header, activeDetailUrl]) =>
        this.service.fetchDetailByRouteLabels(header, activeDetailUrl)
          .pipe(
            tapResponse({
              next: (response: ApartmentDetail) => {

                this.patchState({selectedDetailPage: response})
              },
              error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
            }),
            catchError(() => EMPTY),
            finalize(() => this.patchState({loading: false}))
          )
      ),
    ));

  loadHeaderByHostWithDetail = this.effect(
    (host$: Observable<string>) => host$.pipe(
        tap(()=> console.log("TAP")),
      filter((host) => !!host),
      switchMap((host) => this.service.fetchHeaderByHost(host)
        .pipe(
          tapResponse({
            next: (response: Header) => {

              console.log("PATCH HEADER DETAIL ne radi", response);

            //  this.patchState({header: response});
              if (response.detail.length > 0) {
                this.loadDetailByRouteLabelsEffect(response);
              } else {
                this.router.navigate(['/']);
              }
            },
            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
          }),
          catchError(() => EMPTY),
          finalize(() => this.patchState({loading: false}))
        )
      ),
    ));

/*  loadHeaderByHost = this.effect(
    (host$: Observable<string>) => host$.pipe(
      filter((host) => !!host),
      switchMap((host) => this.service.fetchHeaderByHost(host)
        .pipe(
          tapResponse({
            next: (response: Header) => {
                console.log("loadHeaderByHost PATCH", response);
              this.patchState({header: response});
              this.loadDetailByRouteLabelsEffect(response);
            },
            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
          }),
          catchError(() => EMPTY),
          finalize(() => this.patchState({loading: false}))
        )
      ),
    ));
*/
  loadMyApartmentEffect = this.effect(
    _ => _.pipe(
    //  filter(() => !this.tokenService.isTokenNotValid()),
      tap(() => this.patchState({loading: true})),
      switchMap(
        () => this.service.myApartments()
          .pipe(
            tapResponse({
              next: (response: Page<Apartment>) => this.patchState({page: response}),
              error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
            }),
            catchError(() => EMPTY),
            finalize(() => this.patchState({loading: false}))
          )),
    ),
  );

  readonly createApartmentEffect = this.effect(
    (apartment$: Observable<Partial<Apartment>>) => apartment$.pipe(
      switchMap(
        (apartment) => this.service.createApartment(apartment)
          .pipe(
            tap({
              next: (response) => {
                this.loadMyApartmentEffect();
                this.router.navigate(['']);
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
      tap((detail) => console.log("(effect) delete Detail, id", detail.id)),
      switchMap(
        (detail) => this.service.deleteApartmentDetail(detail)
          .pipe(
            tap({
              next: (response) => {
                this.router.navigate(['/']);
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
                this.loadDetailByDetailIdEffect(item.apartmentDetailId);
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
                this.loadDetailByDetailIdEffect(response.apartmentDetailId);
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
                this.loadDetailByDetailIdEffect(response.apartmentDetailId);
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
                this.router.navigate([response.titleUrl]);
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
                  this.patchState({selectedDetailPage: response});
                  this.patchState({activeDetailUrl: response.titleUrl});
                } else {
                  this.router.navigate([response.titleUrl]);
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


  setHeader(header : Header){
      this.patchState({header: header});
  }


  selectIso(country: string) {
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
    this.patchState({
      selectedDetailPageLabel: label
    });
  }

  constructor() {
     console.log("CONSTRUCTOR STORE");
    super(initialApartmentState);
  }
}
