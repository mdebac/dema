/* tslint:disable */
/* eslint-disable */
import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, tap, throwError} from 'rxjs';
import {BaseService} from './base-service';
import {ApiConfiguration} from './api-configuration';
import {Header} from '../domain/header';
import {Message} from '../domain/message';
import {ErrorService} from "./error.service";
import {ApartmentCriteria} from "../domain/apartment-criteria";
import {Page} from "../util/search-criteria";
import {Apartment} from "../domain/apartment";
import {Util} from "../util/skip-nulls";
import {ApartmentDetail} from "../domain/apartment-detail";
import {ApartmentItem} from "../domain/apartment-item";
import {Customer} from "../domain/customer";

@Injectable({providedIn: 'root'})
export class ApartmentsHttpService extends BaseService {

    errorService = inject(ErrorService);
    url: string;

    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http);
        this.url = this.rootUrl;
    }

    fetchDetailByRouteLabels(header: Header | null, detailUrl: string | null): Observable<ApartmentDetail | null> {

        let detail = "";

        if (header) {

            if (!(!!header && header?.detail.find(a => a.detailUrl !== detailUrl))) {
                if (detailUrl) {
                    detail = detailUrl;
                } else {
                    detail = header.activeDetailUrl;
                }
            } else {
                if (detailUrl) {
                    return of(null);
                } else {
                    detail = header.detail[0].detailUrl;
                }
            }

            const url = this.url + '/find/details';
            console.log('(http request) fetch DetailByRouteLabels URL', url, header.host);
            console.log('(http request) fetch DetailByRouteLabels URL', url, detail);

            // @ts-ignore
            return this.http
                .get<ApartmentDetail>(url, {
                    params: new HttpParams().set("host", header.host).set("detailUrl", detail)
                })
                .pipe(
                    tap((res) => console.log('(http response) fetch DetailByRouteLabels', res)),
                    catchError((err) => {
                        console.log("(http error) fetch DetailByRouteLabels error", err);
                        return this.errorService.handleError(err);
                    }),
                );


        } else {
            return throwError(() => new Error("Header dont exist"));
        }
    }

    myCustomers(host: string | undefined): Observable<Page<Customer>> {
        const url = this.url + '/customers/' + host;
        console.log('(http request) Customers URL ---' + url);
        // @ts-ignore
        return this.http
            .get<Page<Customer>>(url)
            .pipe(
                tap((res) => console.log('(http response) Customers', res)),

                catchError((err) => {
                    console.log("(http error) Customers", err);
                    return this.errorService.handleError(err);
                }),
            );
    }

    myApartments(host: string | undefined): Observable<Page<Apartment>> {
        const url = this.url + '/customers/' + host;
        console.log('(http request) Customers URL ---' + url);
        // @ts-ignore
        return this.http
            .get<Page<Apartment>>(url)
            .pipe(
                tap((res) => console.log('(http response) Customers', res)),

                catchError((err) => {
                    console.log("(http error) Customers", err);
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
        const url = this.url + '/' + detail.mainId + '/details/' + detail.id;
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
        const url = this.url + "/" + detail.mainId + "/details";
        console.log('(http request) create Detail', detail, url);
        return this.http.post<ApartmentDetail>(url, detail).pipe(
            tap((response) => console.log('(http response) Detail created', response)),
            catchError((err) => this.errorService.handleError(err)),
        );
    }

    createItem(item: Partial<ApartmentItem>): Observable<ApartmentItem> {
        const url = this.url + "/" + item.detailId + "/items";
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
        const url = this.url + "/" + item.detailId + "/items";
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
        if (apartment.image) {
            // console.log('(http request) create-update Apartment logo Image appended');
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
        const url = this.url + "/" + detail.mainId + "/details/" + detail.id;
        console.log('(http request) update detail service', detail);
        return this.http.put<ApartmentDetail>(url, detail).pipe(
            tap((response) => console.log('(http response) update detail service', response)),
            catchError((err) => this.errorService.handleError(err)),
        );
    }

    fetchHeaderByHost(host: string): Observable<Header> {
        const url = this.url + '/find/' + host + '/header';
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

    fetchDetailById(detailId: number): Observable<ApartmentDetail> {
        const url = this.url + '/detail/' + detailId;
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

    searchApartments(criteria: ApartmentCriteria): Observable<Page<Apartment>> {
        const url = this.url + '/find';
        console.log('(http request) searchApartments URL ---' + url + ', by criteria', criteria);
        // @ts-ignore
        return this.http
            .get<Page<Apartment>>(url, {
                params: new HttpParams({fromObject: Util.skipNulls(criteria)})
            })
            .pipe(
                tap((res) => console.log('(http response) searchApartments', res)),
                catchError((err) => {
                    console.log("(http error) searchApartments", err);
                    return this.errorService.handleError(err);
                }),
            );
    }

    ping(): Observable<Message> {
        const url = this.url + '/ping';
        console.log('(http request) fetch Ping URL ---' + url);
        // @ts-ignore
        return this.http
            .get<string>(url)
            .pipe(
                tap((res) => console.log('(http response) Ping', res)),
                catchError((err) => {
                    console.log("Ping Load Error", err);
                    return this.errorService.handleError(err);
                }),
            );
    }

    ping2(): Observable<Message> {
        const url = this.url + '/ping2';
        console.log('(http request) fetch Ping2 URL ---' + url);
        // @ts-ignore
        return this.http
            .get<string>(url)
            .pipe(
                tap((res) => console.log('(http response) Ping2', res)),
                catchError((err) => {
                    console.log("Ping2 Load Error", err);
                    return this.errorService.handleError(err);
                }),
            );
    }

}
