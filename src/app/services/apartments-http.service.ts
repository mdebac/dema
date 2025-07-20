/* tslint:disable */
/* eslint-disable */
import {HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, of, tap} from 'rxjs';
import {BaseService} from './base-service';
import {ApiConfiguration} from './api-configuration';
import {Header} from '../domain/header';
import {Message} from '../domain/message';

@Injectable({providedIn: 'root'})
export class ApartmentsHttpService extends BaseService {

 // errorService = inject(ErrorService);
  url: string;

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
    this.url = this.rootUrl + '/apartments';
  }

  fetchHeaderByHost(apartment: string): Observable<Header> {
    const url = this.url + '/find/' + apartment + '/header';
    console.log('(http request) fetch Header URL ---' + url);
    // @ts-ignore
    return this.http
      .get<Header>(url)
      .pipe(
        tap((res) => console.log('(http response) Header', res)),
     /*   catchError((err) => {
          console.log("Header load error", err);
          return this.errorService.handleError(err);
        }),
     */ );
  }


  ping(): Observable<Message> {
    const url = this.url + '/ping';
    console.log('(http request) fetch Ping URL ---' + url);
    // @ts-ignore
    return this.http
      .get<string>(url)
      .pipe(
        tap((res) => console.log('(http response) Ping', res)),
     /*   catchError((err) => {
          console.log("Ping Load Error", err);
          return this.errorService.handleError(err);
        }),*/
      );
  }


}
