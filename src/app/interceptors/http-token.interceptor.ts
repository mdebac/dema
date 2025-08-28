import {inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthStore} from "../services/authentication/auth-store";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  auth = inject(AuthStore);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const captcha = request.headers.get("captcha-response");

    if (request.url.includes('auth/')) {
      return next.handle(request);
    }
    const token = this.auth.token;
    if (token) {
      const authReq = request.clone({
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
            'captcha-response': captcha ? captcha : ""
          },
        )
      });
      return next.handle(authReq);
    }
    else{
      const normalReq = request.clone({
        headers: new HttpHeaders({
            'captcha-response': captcha ? captcha : ""
          },
        )
      });
      return next.handle(normalReq);
    }
  }
}
