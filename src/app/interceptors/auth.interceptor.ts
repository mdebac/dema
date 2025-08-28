import { HttpHeaders,
    HttpInterceptorFn,
} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthStore} from "../services/authentication/auth-store";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const auth = inject(AuthStore);
    const token = auth.token;
    const captcha = req.headers.get("captcha-response");

    if (req.url.includes('auth/')) {
        return next(req);
    }

    if (token) {
        const authReq = req.clone({
            headers: new HttpHeaders({
                    Authorization: 'Bearer ' + token,
                    'captcha-response': captcha ? captcha : ""
                },
            )
        });
        return next(authReq);
    } else {
        const normalReq = req.clone({
            headers: new HttpHeaders({
                    'captcha-response': captcha ? captcha : ""
                },
            )
        });
        return next(normalReq);
    }
}
