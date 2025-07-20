/* tslint:disable */
/* eslint-disable */
/*
import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, tap} from 'rxjs';
import { BaseService } from '../../../../shop-backend-2/shop-backend/book-network-ui/src/app/services/base-service';
import { ApiConfiguration } from '../../../../shop-backend-2/shop-backend/book-network-ui/src/app/services/api-configuration';
import {Apartment} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/modules/apartments/domain/apartment";
import {Page} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/util/search-criteria";
import {ApartmentCriteria} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/modules/apartments/domain/apartment-criteria";
import {ErrorService} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/modules/apartments/services/error.service";
import {Util} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/util/skip-nulls";
import {ApartmentDetail} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/modules/apartments/domain/apartment-detail";
import {Message} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/modules/apartments/domain/message";
import {ApartmentItem} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/modules/apartments/domain/apartment-item";
import {Header} from "../../../../shop-backend-2/shop-backend/book-network-ui/src/app/modules/apartments/domain/header";

@Injectable({ providedIn: 'root' })
export class ApartmentsHttpService extends BaseService {

  errorService = inject(ErrorService);
  url:string;

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
    this.url = this.rootUrl + '/apartments';
  }

  searchApartments(criteria: ApartmentCriteria): Observable<Page<Apartment>> {
    const url = this.url + '/find';
    console.log('getApartmentsPage URL ---' + url + ', by criteria', criteria);
    // @ts-ignore
    return this.http
      .get<Page<Apartment>>(url, {
        params: new HttpParams({fromObject: Util.skipNulls(criteria)})
      })
      .pipe(
        tap((res) => console.log('searchApartments response--', res)),
        catchError((err) => {
          console.log("searchApartments error", err);
          return this.errorService.handleError(err);
        }),
      );
  }

  generateUrl(title: string|null): Observable<Message> {
    const url = this.url + '/generate-url';
    console.log('+++generateUrl URL ---' + url + ', by search' + title);
    // @ts-ignore
    const t = !!title ? title : "";
    return this.http
      .get<Message>(url, {
        params: new HttpParams().set("title", t)
      })
      .pipe(
        tap((res) => console.log('generateUrl response--', res)),
        catchError((err) => {
          console.log("generateUrl error", err);
          return this.errorService.handleError(err);
        }),
      );
  }

  generateDetailUrl(title: string, apartmentId:number): Observable<Message> {
    const url = this.url + '/generate-detail-url';
    console.log('+++generateUrl URL ---' + url + ', by search' + title);
    // @ts-ignore
    return this.http
      .get<string>(url, {
        params: new HttpParams().set("title", title).set("apartmentId", apartmentId)
      })
      .pipe(
        tap((res) => console.log('generateUrl response--', res)),
        catchError((err) => {
          console.log("generateUrl error", err);
          return this.errorService.handleError(err);
        }),
      );
  }

  fetchDetailByRouteLabels(header: Header | null, detail:string | null): Observable<ApartmentDetail> {
    let detailUrl = "";
    if(header){
      if(detail){
        detailUrl = detail;
      }else{
        detailUrl = header.detail[0].detailUrl;
      }
    }
   // console.log("ulaz detailUrl", detail);
  //  console.log("izlaz detailUrl", detailUrl);
    const url = this.url + '/find/'+header?.apartmentUrl+'/details';
    console.log('(http request) fetch DetailByRouteLabels URL', url, detailUrl);
    // @ts-ignore
    return this.http
      .get<ApartmentDetail>(url,{
        params: new HttpParams().set("detailUrl", detailUrl)
      })
      .pipe(
        tap((res) => console.log('(http response) fetch DetailByRouteLabels', res)),
        catchError((err) => {
          console.log("(http error) fetch DetailByRouteLabels error", err);
          return this.errorService.handleError(err);
        }),
      );
  }

  fetchDetailById(detailId:number): Observable<ApartmentDetail> {
    const url = this.url + '/detail/'+detailId;
    console.log('(http request) fetch DetailById URL ---' + url);
    // @ts-ignore
    return this.http
      .get<ApartmentDetail>(url)
      .pipe(
        tap((res) => console.log('(http response) fetch DetailById', res)),
        catchError((err) => {
          console.log("(http error) fetch DetailById error", err);
          return this.errorService.handleError(err);
        }),
      );
  }

  fetchHeaderByHost(apartment: string): Observable<Header> {
    const url = this.url + '/find/'+apartment+'/header';
    console.log('(http request) fetch Header URL ---' + url);
    // @ts-ignore
    return this.http
      .get<Header>(url)
      .pipe(
        tap((res) => console.log('(http response) Header', res)),
        catchError((err) => {
          console.log("Header load error", err);
          return this.errorService.handleError(err);
        }),
      );
  }

  myApartments(): Observable<Page<Apartment>> {
    const url = this.url + '/my';
    console.log('(http request) myApartments URL ---' + url);
    // @ts-ignore
    return this.http
      .get<Page<Apartment>>(url)
      .pipe(
        tap((res) => console.log('(http response) myApartments', res)),

        catchError((err) => {
          console.log("myApartments error", err);
          return this.errorService.handleError(err);
        }),
      );
  }

  deleteApartment(id: number) {
    const url = this.url + '/' + id;
    console.log('(http request) delete Apartment URL', url);
    return this.http.delete(url)
      .pipe(
        tap((response) => console.log('(http response) Apartment deleted')),
        catchError((err) => this.errorService.handleError(err)),
      );
  }

  deleteApartmentDetail(detail: ApartmentDetail) {
    const url = this.url + '/' + detail.apartmentId + '/details/' + detail.id;
    console.log('(http request) delete Detail URL', url);
    return this.http.delete(url)
      .pipe(
        tap((response) => console.log('(http response) Detail deleted')),
        catchError((err) => this.errorService.handleError(err)),
      );
  }

  deleteItem(item: ApartmentItem) {
    const url = this.url + '/items/' + item.id;
    console.log('(http request) delete Item URL', url);
    return this.http.delete(url)
      .pipe(
        tap((response) => console.log('(http response) Item deleted')),
        catchError((err) => this.errorService.handleError(err)),
      );
  }

  createApartmentDetail(detail: Partial<ApartmentDetail>): Observable<ApartmentDetail> {
    const url = this.url+"/"+detail.apartmentId+"/details";
    console.log('(http request) create Detail', detail, url);
    return this.http.post<ApartmentDetail>(url, detail).pipe(
      tap((response) => console.log('(http response) Detail created', response)),
      catchError((err) => this.errorService.handleError(err)),
    );
  }

  createItem(item: Partial<ApartmentItem>): Observable<ApartmentItem> {
    const url = this.url+"/"+item.apartmentDetailId+"/items";
    console.log('(http request) create Item', item, url);

   let formData = new FormData();
       if (item.image) {
        formData.append('file', item.image);
         item.image = null;
      }
      formData.append('payload', new Blob([JSON.stringify(item)], {
        type: 'application/json'
      }));

    return this.http.post<ApartmentItem>(url, formData).pipe(
      tap((response) => console.log('(http response) create Item', response)),
      catchError((err) => this.errorService.handleError(err)),
    );

  }

  updateItem(item: Partial<ApartmentItem>): Observable<ApartmentItem> {
    const url = this.url+"/"+item.apartmentDetailId+"/items";
    console.log('(http request) update Item', item, url);

    let formData = new FormData();
    if (item.image) {
      formData.append('file', item.image);
      item.image = null;
    }
    formData.append('payload', new Blob([JSON.stringify(item)], {
      type: 'application/json'
    }));

    return this.http.put<ApartmentItem>(url, formData).pipe(
      tap((response) => console.log('(http response) update Item', response)),
      catchError((err) => this.errorService.handleError(err)),
    );

  }

  createApartment(apartment: Partial<Apartment>): Observable<Apartment> {
    const url = this.url;
    console.log('(http request) create-update Apartment', apartment);
    let formData = new FormData();
    if(apartment.image){
      console.log('(http request) create-update Apartment logo Image appended');
      formData.append('file', apartment.image);
      apartment.image = null;
    }
    formData.append('payload', new Blob([JSON.stringify(apartment)], {
      type: 'application/json'
    }));
    return this.http.post<Apartment>(url, formData).pipe(
      tap((response) => console.log('(http response) create-update Apartment:', response)),
      catchError((err) => this.errorService.handleError(err)),
    );
  }

  updateApartmentDetail(detail: Partial<ApartmentDetail>): Observable<ApartmentDetail> {
    const url = this.url+"/"+detail.apartmentId+"/details/" + detail.id;
    console.log('(http request) update detail service', detail);
    return this.http.put<ApartmentDetail>(url, detail).pipe(
      tap((response) => console.log('(http response) update detail service', response)),
      catchError((err) => this.errorService.handleError(err)),
    );
  }

}
*/
