import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, shareReplay, tap} from 'rxjs/operators';
import {AuthenticationService} from "../authentication.service";
import {JwtHelperService} from "@auth0/angular-jwt";

const AUTH_DATA = "auth_data";

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    authService = inject(AuthenticationService);
    private subject = new BehaviorSubject<string | null>(null);

    token$ : Observable<string | null> = this.subject.asObservable();
    isLoggedIn$ : Observable<boolean>;
    isLoggedOut$ : Observable<boolean>;

    constructor() {
        this.isLoggedIn$ = this.token$.pipe(
            map(token => this.isTokenValid(token)),
        );
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
        const token = localStorage.getItem(AUTH_DATA);
        if (token) {
            this.subject.next(JSON.parse(token));
        }
    }

    isTokenValid(token:any|null) {

       // console.log("is token valid?", token)
        if (!token) {
            console.log("token dont exist")
            return false;
        }
      //  console.log("token exist")

        const jwtHelper = new JwtHelperService();
        const isTokenExpired = jwtHelper.isTokenExpired(token.token ? token.token : token);
        if (isTokenExpired) {
            localStorage.clear();
           // console.log("token expired")
            return false;
        }
     //   console.log("token is valid")
        return true;
    }

    get userRoles(): string[] {
        const token = localStorage.getItem(AUTH_DATA);
        if (token) {
            const token2 = JSON.parse(token);
            const jwtHelper = new JwtHelperService();
            const decodedToken = jwtHelper.decodeToken(token2);
            console.log("get userRoles", decodedToken.authorities);
            return decodedToken.authorities;
        }
        return [];
    }

    login(email:string, password:string): Observable<string | undefined> {
        return this.authService.authenticate({
            body: {email, password}
        })
            .pipe(
                tap(user => {
                    if(user.token){
                        this.subject.next(user.token);
                        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
                    }
                }),
                map(a=>a.token),
                shareReplay()
            );
    }

    /*
        this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;
        this.router.navigate(['']);
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.error);
        }
      }
    });
     */


    logout() {
        this.subject.next(null);
        localStorage.removeItem(AUTH_DATA);
    }


}