import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';

import {FormsModule} from '@angular/forms';
import {AuthenticationRequest} from "../../domain/authentication-request";
import {AuthStore} from "../../services/authentication/auth-store";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFabButton} from "@angular/material/button";
import {ApartmentStore} from "../../services/apartments-store.service";
import {LetDirective} from "@ngrx/component";
import {TranslatePipe} from "@ngx-translate/core";
import {first} from "rxjs";
import {ReCaptchaV3Service} from "ng-recaptcha-2";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
    FormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFabButton,
    LetDirective,
    TranslatePipe,
    RouterLink
],
})
export class LoginComponent {

    readonly router = inject(Router);
    readonly authStore= inject(AuthStore);
    readonly store= inject(ApartmentStore);
    readonly recaptchaV3Service = inject(ReCaptchaV3Service);

    authRequest: AuthenticationRequest = {email: '', password: ''};
    errorMsg: Array<string> = [];
    isMobile$ = this.store.isMobile$;

    showPassword: boolean = false;

    login() {
        this.errorMsg = [];

        this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
            this.authStore
                .login(this.authRequest.email, this.authRequest.password, token)
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.router.navigate(['']);
                    },
                    error: (err) => {
                        this.errorMsg = err.error.validationErrors;
                    }
                });
        });
    }

    register() {
        this.router.navigate(['register']);
    }

    // this.authService.authenticate({
    //   body: this.authRequest
    // }).subscribe({
    //   next: (res) => {
    //     this.tokenService.token = res.token as string;
    //     this.router.navigate(['']);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     if (err.error.validationErrors) {
    //       this.errorMsg = err.error.validationErrors;
    //     } else {
    //       this.errorMsg.push(err.error.error);
    //     }
    //   }
    // });


}
