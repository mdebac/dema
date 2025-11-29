import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';

import {FormsModule} from '@angular/forms';
import {RegistrationRequest} from "../../domain/registration-request";
import {AuthenticationService} from "../../services/authentication.service";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFabButton} from "@angular/material/button";
import {first} from "rxjs";
import {ReCaptchaV3Service} from "ng-recaptcha-2";

@Component({
    selector: 'dema-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [
    FormsModule,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFabButton
],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

    readonly recaptchaV3Service = inject(ReCaptchaV3Service);
    readonly authService = inject(AuthenticationService);
    readonly router = inject(Router);

    registerRequest: RegistrationRequest = {email: '', firstname: '', lastname: '', password: '', host: ''};
    errorMsg: Array<string> = [];
    showPassword = false;

    constructor(
    ) {
        console.log("RegisterComponent ngOnInit")
    }

    login() {
        this.router.navigate(['login']);
    }

    register() {
        this.errorMsg = [];

        this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
            this.authService
                .register({
                    body: this.registerRequest,
                    captcha: token
                })
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.router.navigate(['activate-account']);
                    },
                    error: (err) => {
                        this.errorMsg = err.error.validationErrors;
                    }
                });
        });
    }
}
