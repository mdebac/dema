/* tslint:disable */
/* eslint-disable */
import {HttpClient, HttpParams} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, concatMap, Observable, of, tap, throwError} from 'rxjs';
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
import {Menu} from "../domain/menu";
import {map} from "rxjs/operators";
import {DetailWithHeader} from "../domain/detail-with-header";

@Injectable({providedIn: 'root'})
export class ApartmentsHttpService extends BaseService {

    errorService = inject(ErrorService);
    url: string;

    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http);
        this.url = this.rootUrl;
    }

    fetchDetailByRouteLabels(header: Header | null,
                             detailUrl: string | null | undefined,
                             panelUrl: string | null | undefined): Observable<ApartmentDetail | null> {
        let detail = "";
        let panel = "";

        if (header) {
            if (header.id) {

                if(detailUrl){

                    const menu = header?.menus.find(a => a.menuUrl === detailUrl);
                    if (menu) {
                        if (detailUrl) {
                            detail = detailUrl;
                            if (panelUrl && menu.panels.find(a => a.panelUrl === panelUrl)) {
                                panel = panelUrl;
                            } else {
                                panel = menu.panels[0].panelUrl;
                            }
                        } else {
                            detail = header.activeDetailUrl;
                            panel = header.activePanelUrl;
                        }
                    } else {
                        detail = header.activeDetailUrl;
                        panel = header.activePanelUrl;
                    }

                }else{
                    const menu = header?.menus.find(a => a.menuUrl === detailUrl);
                }

            } else {
                detail = header.activeDetailUrl;
                panel = header.activePanelUrl;
            }

            const url = this.url + '/find/details';
            console.log('(http request) fetch DetailByRouteLabels URL', url, detail, panel);
            // @ts-ignore
            return this.http
                .get<ApartmentDetail>(url, {
                    params: new HttpParams().set("menuUrl", detail).set("panelUrl", panel)
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

    myDomains(): Observable<Page<Apartment>> {
        const url = this.url + '/find/domains';
        console.log('(http request) Domains URL ---' + url);
        // @ts-ignore
        return this.http
            .get<Page<Apartment>>(url)
            .pipe(
                tap((res) => console.log('(http response) Domains', res)),

                catchError((err) => {
                    console.log("(http error) Domains", err);
                    return this.errorService.handleError(err);
                }),
            );
    }


    myCustomers(): Observable<Page<Apartment>> {
        const url = this.url + '/customers';
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
                catchError((err) => {
                    console.log("(http error) delete Apartment", err);
                    return this.errorService.handleError(err);
                }),
            );
    }

    updateUsersRole(userId: number, role: string) {
        const url = this.url + '/users/ ' + userId + ' /roles/' + role;
        console.log('(http request) update UsersRole URL', url);
        return this.http.get(url)
            .pipe(
                tap((response) => console.log('(http response)  update UsersRole')),
                catchError((err) => {
                    console.log("(http error) update UsersRole", err);
                    return this.errorService.handleError(err);
                }),
            );
    }

    deleteApartmentDetail(detail: ApartmentDetail) {
        const url = this.url  + '/' + detail.menu.mainId +  '/' + detail.menu.id +  '/' + detail.panel.id + '/details/' + detail.id;
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

    createDetail(detail: Partial<ApartmentDetail>): Observable<DetailWithHeader> {
        const url = this.url + "/details";
        const fetchHeader = this.fetchHeader();
        console.log('(http request) create Detail', detail, url);
        return this.http.post<ApartmentDetail>(url, detail).pipe(
            tap((response) => console.log('(http response) Detail created', response)),
            concatMap(detail => {
                return fetchHeader.pipe(
                    map(h=> { return { detail: detail, header: h }})
                );
            }),
            catchError((err) => this.errorService.handleError(err)),
        );
    }

    updateDetail(detail: Partial<ApartmentDetail>): Observable<DetailWithHeader> {
        const url = this.url + "/details/" + detail.id;
        const fetchHeader = this.fetchHeader();
        console.log('(http request) update detail service', detail);
        return this.http.put<ApartmentDetail>(url, detail).pipe(
            tap((response) => console.log('(http response) update detail service', response)),
            concatMap(detail => {
                return fetchHeader.pipe(
                    map(h=> { return { detail: detail, header: h }})
                );
            }),
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

    createMain(apartment: Partial<Apartment>): Observable<void> {
        const url = this.url;
        console.log('(http request) create-update Web page', apartment);
        let formData = new FormData();
        if (apartment.image) {
            formData.append('file', apartment.image);
            apartment.image = null;
        }
        if (apartment.imageBackground) {
            formData.append('fileBg', apartment.imageBackground);
            apartment.imageBackground = null;
        }
        formData.append('payload', new Blob([JSON.stringify(apartment)], {
            type: 'application/json'
        }));
        return this.http.post<void>(url, formData).pipe(
            tap((response) => console.log('(http response) create-update Web page:', response)),
            catchError((err) => this.errorService.handleError(err)),
        );
    }


    updateMenu(menu: Partial<Menu>): Observable<Menu> {
        const url = this.url + "/menu/" + menu.id;
        console.log('(http request) update Menu', menu);
        return this.http.put<Menu>(url, menu).pipe(
            tap((response) => console.log('(http response) update Menu', response)),
            catchError((err) => this.errorService.handleError(err)),
        );
    }

    fetchHeader(): Observable<Header> {
        const url = this.url + '/find/header';
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
