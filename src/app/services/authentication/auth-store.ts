import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, Observable, switchMap} from 'rxjs';
import {filter, map, shareReplay, tap} from 'rxjs/operators';
import {AuthenticationService} from "../authentication.service";
import {JwtHelperService} from "@auth0/angular-jwt";
import {Router} from "@angular/router";
import {Roles} from "../../domain/roles";
import {Hosts} from "../../domain/hosts";
import {User} from "../../domain/user";

const AUTH_DATA = "auth_data";

@Injectable({
    providedIn: 'root'
})
export class AuthStore {
    authService = inject(AuthenticationService);
    router= inject(Router);
    private tokenSubject = new BehaviorSubject<string | null>(null);

    token$ : Observable<string | null> = this.tokenSubject.asObservable();
    isLoggedIn$ : Observable<boolean>;
    isLoggedOut$ : Observable<boolean>;
    user$ : Observable<User>;
    roles$ : Observable<string[]>;

    constructor() {

        this.isLoggedIn$ = this.token$.pipe(
            map(token => this.isTokenValid(token)),
        );

        this.user$ = this.token$.pipe(
            map(token => this.userFromToken(token)),
        );

        this.roles$ = this.token$.pipe(
            map(token => this.rolesFromToken(token)),
        );

        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));
        const token = localStorage.getItem(AUTH_DATA);
        if (token) {
            this.tokenSubject.next(JSON.parse(token));
        }
    }

    isTokenNotValid() {

       const token = localStorage.getItem(AUTH_DATA);
        /*    if (token) {
               const token2 = JSON.parse(token);
               const jwtHelper = new JwtHelperService();
               const decodedToken = jwtHelper.decodeToken(token2.token ? token2.token : token2);
               console.log("get userRoles", decodedToken.authorities);
               return decodedToken.authorities;
           }*/

        return !this.isTokenValid(token);
    }

    isTokenValid(token:any|null) {
       // console.log("is token valid?", token)
        if (!token) {
          //  console.log("token dont exist")
            return false;
        }
      //  console.log("token exist")
        const jwtHelper = new JwtHelperService();
        const isTokenExpired = jwtHelper.isTokenExpired(token.token ? token.token : token);
        if (isTokenExpired) {
            this.logout();
           // console.log("token expired")
            return false;
        }
     //   console.log("token is valid")
        return true;
    }

    userFromToken(token2:any|null) {
        if(token2){
            const jwtHelper = new JwtHelperService();
            const decodedToken = jwtHelper.decodeToken(token2.token ? token2.token : token2);
            return decodedToken.fullName;
        }else{
            return "";
        }
    }

    rolesFromToken(token2:any|null) {
        if(token2){
            const jwtHelper = new JwtHelperService();
            const decodedToken = jwtHelper.decodeToken(token2.token ? token2.token : token2);
            return decodedToken.authorities;
        }else{
            return [];
        }
    }

    get userRoles(): string[] {
        const token = localStorage.getItem(AUTH_DATA);
        if (token) {
            const token2 = JSON.parse(token);
            const jwtHelper = new JwtHelperService();
            const decodedToken = jwtHelper.decodeToken(token2.token ? token2.token : token2);
          //  console.log("get userRoles", decodedToken.authorities);
            return decodedToken.authorities;
        }
        return [];
    }

    get user(): string {
        const token = localStorage.getItem(AUTH_DATA);
        if (token) {
            const token2 = JSON.parse(token);
            const jwtHelper = new JwtHelperService();
            const decodedToken = jwtHelper.decodeToken(token2.token ? token2.token : token2);

            return decodedToken.fullName;
        }
        return "";
    }

    authorize(role: Roles): boolean {
      return this.userRoles.includes(role.toUpperCase());
    }

    get token() {
        const token = localStorage.getItem(AUTH_DATA);
        if (token) {
            const token2 = JSON.parse(token)
            return token2.token;
        }
    }

    login(email:string, password:string, token: string): Observable<string | undefined> {
        return this.authService.authenticate({
            body: {email, password},
            captcha: token
        })
            .pipe(
                tap(user => {
                    if(user.token){
                        this.tokenSubject.next(user.token);
                        localStorage.setItem(AUTH_DATA, JSON.stringify(user));
                    }
                }),
                map(a=>a.token),
                shareReplay()
            );
    }
    //
    // readonly recaptchaConfirmNewPassword =
    //     this.effect((params$: Observable<{
    //         password: string;
    //         token: string;
    //     }>) => params$.pipe(
    //         switchMap(({password, token}) =>
    //             this.recaptchaV3Service.execute('importantAction')
    //                 .pipe(
    //                     tap({
    //                         next: (captcha: string) => this.confirmNewPassword({password, token, captcha}),
    //                         error: (error) => console.log("recaptchaConfirmNewPassword error", error),
    //                     }),
    //                     catchError(() => EMPTY)
    //                 )
    //         ),
    //     ));
    //

    logout() {
        this.tokenSubject.next(null);
        localStorage.removeItem(AUTH_DATA);
        this.router.navigate(['/']);
    }


}
