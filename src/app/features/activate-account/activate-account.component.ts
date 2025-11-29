import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {first, skipUntil} from 'rxjs';

import {CodeInputModule} from 'angular-code-input';
import {AuthenticationService} from "../../services/authentication.service";
import {MatFabButton} from "@angular/material/button";
import {TranslatePipe} from "@ngx-translate/core";
import {AuthStore} from "../../services/authentication/auth-store";
import {ApartmentStore} from "../../services/apartments-store.service";
import {ReCaptchaV3Service} from "ng-recaptcha-2";

@Component({
    selector: 'app-activate-account',
    templateUrl: './activate-account.component.html',
    styleUrls: ['./activate-account.component.scss'],
    imports: [CodeInputModule, MatFabButton, TranslatePipe],
})
export class ActivateAccountComponent {

    readonly router = inject(Router);
    readonly authService = inject(AuthenticationService);
    readonly recaptchaV3Service = inject(ReCaptchaV3Service);

    message = '';
    isOkay = true;
    submitted = false;

    private confirmAccount(token: string) {

        this.recaptchaV3Service.execute('importantAction').subscribe((captcha) => {
            this.authService.confirm({
                token,
                captcha: captcha
            })
                .pipe(first())
                .subscribe({
                    next: () => {
                        this.message = 'Your account has been successfully activated.\nNow you can proceed to login';
                        this.submitted = true;
                    },
                    error: () => {
                        this.message = 'Token has been expired or invalid';
                        this.submitted = true;
                        this.isOkay = false;
                    }
                });
        });
    }

    redirectToLogin() {
        this.router.navigate(['login']);
    }

    onCodeCompleted(token: string) {
        this.confirmAccount(token);
    }

    protected readonly skipUntil = skipUntil;
}
