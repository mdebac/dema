import {inject, Injectable} from "@angular/core";
import {catchError, EMPTY, finalize, Observable, switchMap, tap} from "rxjs";
import {ComponentStore} from '@ngrx/component-store';
import {ApiError} from "../domain/api-error";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {CvData} from "../domain/cv-data";
import {CvDataHttpService} from "./cv-data-http.service";
import {Page, SearchCriteria} from "../util/search-criteria";

export interface CVState {

  page: Page<CvData>;

  paginationPage: number,
  paginationSize: number,
  paginationSort: string,

  loading: boolean;
  error: ApiError | null;
}

export const initialCVState: CVState = {
  page: Page.empty(),

  paginationPage: 0,
  paginationSize: 20,
  paginationSort: 'created_on,desc',

  loading: false,
  error: null,
};

@Injectable()
export class CVStore extends ComponentStore<CVState> {
  readonly service = inject(CvDataHttpService);

  cvPage$: Observable<Page<CvData>> = this.select((state) => state.page);
  loading$: Observable<boolean> = this.select((state) => state.loading);
  error$: Observable<ApiError | null> = this.select((state) => state.error);
  paginationPage$: Observable<number> = this.select((state) => state.paginationPage);
  paginationSize$: Observable<number> = this.select((state) => state.paginationSize);
  paginationSort$: Observable<string> = this.select((state) => state.paginationSort);


  cvCriteria$: Observable<SearchCriteria> = this.select(
    this.paginationPage$,
    this.paginationSize$,
    this.paginationSort$,
    (page, size, sort) => {
      return {page, size, sort} as SearchCriteria;
    }
  );

  cvList$: Observable<CvData[]> = this.select(
    this.cvPage$,
    (page) => {
      return page.content;
    }
  );

  cvCount$: Observable<number> = this.select(
    this.cvPage$,
    (page) => {
      return page.content.length;
    }
  );

  loadCVEffect = this.effect(
    (criteria$: Observable<SearchCriteria>) => criteria$.pipe(
      tap(() => this.patchState({loading: true})),
      switchMap(
        (criteria) => this.service.searchCVData(criteria)
          .pipe(
            tapResponse({
              next: (response: Page<CvData>) => this.patchState({page: response}),
              error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
            }),
            catchError(() => EMPTY),
            finalize(() => this.patchState({loading: false}))
          ),
      ),
    )
  );


  readonly createCvDataEffect = this.effect(
    (cvData$: Observable<CvData>) => cvData$.pipe(
      switchMap(
        (cvData) => this.service.createCvData(cvData)
          .pipe(
            tap({
              next: (response) => {
                //notification data is sent
                //  this.router.navigate(['my']);
              },
              error: (error) => this.patchState({error: error.error}),
            }),
            catchError(() => EMPTY),
            finalize(() => {
              },
            )),
      ),
    ));

  readonly downloadReportEffect = this.effect((params$: Observable<{ id: number; name: string }>) => params$.pipe(
    switchMap(
      async ({id, name}) => this.service.downloadReport(id, name)
    ),
  ));

  constructor() {
    super(initialCVState);
  }
}
