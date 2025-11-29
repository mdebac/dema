/* tslint:disable */
/* eslint-disable */
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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
            if (header.main.id) {

                if (detailUrl) {

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
                            detail = header.activeTopMenuUrl;
                            panel = header.activeSideMenuUrl;
                        }
                    } else {
                        detail = header.activeTopMenuUrl;
                        panel = header.activeSideMenuUrl;
                    }

                } else {
                    const menu = header?.menus[0];
                    detail = menu.menuUrl;
                    panel = menu.panels[0].panelUrl;
                }

            } else {
                detail = header.activeTopMenuUrl;
                panel = header.activeSideMenuUrl;
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
        const url = this.url + '/' + detail.topMenu.mainId + '/' + detail.topMenu.id + '/' + detail.topMenu.id + '/details/' + detail.id;
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

        const formData = new FormData();
        if (detail.topMenu?.image) {
           formData.append('top', detail.topMenu.image);
           detail.topMenu.image = null;
        }
        if (detail.sideMenu?.image) {
            formData.append('side', detail.sideMenu.image);
           detail.sideMenu.image = null;
        }
        formData.append('payload', new Blob([JSON.stringify(detail)], {
            type: 'application/json'
        }));
        // //TODO images
        // console.log('(http request) formData', formData.values());

        return this.http.post<ApartmentDetail>(url, formData).pipe(
            tap((response) => console.log('(http response) Detail created', response)),
            concatMap(detail => {
                return fetchHeader.pipe(
                    map(h => {
                        return {detail: detail, header: h}
                    })
                );
            }),
            catchError((err) => this.errorService.handleError(err)),
        );
    }

    updateDetail(detail: Partial<ApartmentDetail>): Observable<DetailWithHeader> {
        const url = this.url + "/details";
        const fetchHeader = this.fetchHeader();
        console.log('(http request) update detail service', detail);

        let formData = new FormData();
        if (detail.topMenu?.image) {
            formData.append('top', detail.topMenu.image);
            detail.topMenu.image = null;
        }
        if (detail.sideMenu?.image) {
            formData.append('side', detail.sideMenu.image);
            detail.sideMenu.image = null;
        }
        formData.append('detail', new Blob([JSON.stringify(detail)], {
            type: 'application/json'
        }));

        return this.http.put<ApartmentDetail>(url, formData).pipe(
            tap((response) => console.log('(http response) update detail service', response)),
            concatMap(detail => {
                return fetchHeader.pipe(
                    map(h => {
                        return {detail: detail, header: h}
                    })
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

    createMain(apartment: Partial<Apartment>): Observable<Header> {
        const url = this.url;
        console.log('(http request) create-update Web page', url, apartment);
        const fetchHeader = this.fetchHeader();
        let formData = new FormData();
        if (apartment.iconImage) {
            formData.append('file', apartment.iconImage);
            apartment.iconImage = null;
        }
        if (apartment.backgroundImage) {
            formData.append('fileBg', apartment.backgroundImage);
            apartment.backgroundImage = null;
        }
        formData.append('payload', new Blob([JSON.stringify(apartment)], {
            type: 'application/json'
        }));
        return this.http.post<void>(url, formData).pipe(
            tap((response) => console.log('(http response) create-update Main')),
            concatMap(_ => {
                return fetchHeader.pipe(
                    map(header => {
                        return header
                    })
                );
            }),
            catchError((err) => this.errorService.handleError(err)),
        );
    }


    updateMenu(menu: Partial<Menu>): Observable<Menu> {
        const url = this.url + "/menu/" + menu.id;
        console.log('(http request) update Menu', menu);

        const formData = new FormData();
        if (menu.image) {
            formData.append('file', menu.image);
            menu.image = null;
        }
        formData.append('menu', new Blob([JSON.stringify(menu)], {
            type: 'application/json'
        }));

        return this.http.put<Menu>(url, formData).pipe(
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


    sendForgotPasswordEmail(email: string, token: string): Observable<void> {
        const url = this.url + '/auth/forgot-password-email';
        const headers = new HttpHeaders().set('captcha-response', token);

        console.log('(http request) sendForgotPasswordEmail URL ---' + url, email);
        // @ts-ignore
        return this.http
            .get<void>(url, {
                params: new HttpParams().set("email", email), headers: headers
            },)
            .pipe(
                tap((res) => console.log('(http response) sendForgotPasswordEmail', res)),
                catchError((err) => {
                    console.log("(http error) sendForgotPasswordEmail error", err);
                    return this.errorService.handleError(err);
                }),
            );
    }

    confirmNewPassword(password: string, token: string, captcha: string): Observable<void> {
        const url = this.url + '/auth/confirm-new-password';
        const headers = new HttpHeaders().set('captcha-response', captcha);
        const request = {password: password, token: token};
        console.log('(http request) confirmNewPassword URL ---' + url);
        // @ts-ignore
        return this.http
            .post<void>(url, request, { headers: headers })
            .pipe(
                tap((res) => console.log('(http response) confirmNewPassword', res)),
                catchError((err) => {
                    console.log("(http error) confirmNewPassword error", err);
                    return this.errorService.handleError(err);
                }),
            );
    }

    /*
      createCvData(cvData: CvData): Observable<void> {
        const headers = new HttpHeaders().set('captcha-response', cvData.captchaResponse);
        const url = this.url;
        console.log('(http request) create CvData', cvData);
        console.log('(http request) create CvData headers', headers);
        let formData = new FormData();
        if (cvData.content) {
          formData.append('file', cvData.content);
          cvData.content = null;
        }
        formData.append('payload', new Blob([JSON.stringify(cvData)], {
          type: 'application/json'
        }));
        return this.http.post<void>(url, formData, {headers: headers}).pipe(
          tap((response) => console.log('(http response) create CvData', response)),
          catchError((err) => {
            console.log("(http error) create CvData", err);
            return this.errorService.handleError(err);
          }),
        );
      }
     */

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
