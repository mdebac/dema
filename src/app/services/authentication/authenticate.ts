/* tslint:disable */
/* eslint-disable */
import {HttpClient, HttpContext, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {AuthenticationRequest} from "../../domain/authentication-request";
import {StrictHttpResponse} from "../../domain/strict-http-response";
import {AuthenticationResponse} from "../../domain/authentication-response";
import {RequestBuilder} from "../../domain/request-builder";


export interface Authenticate$Params {
    body: AuthenticationRequest,
    captcha: string
}

export function authenticate(http: HttpClient, rootUrl: string, params: Authenticate$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    const rb = new RequestBuilder(rootUrl, authenticate.PATH, 'post');

    if (params) {
        rb.body(params.body, 'application/json');
        rb.header("captcha-response", params.captcha);
    }

    return http.request(
        rb.build({responseType: 'json', accept: 'application/json', context})
    ).pipe(
        filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
            return r as StrictHttpResponse<AuthenticationResponse>;
        })
    );
}

authenticate.PATH = '/auth/authenticate';
