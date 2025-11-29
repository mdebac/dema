import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {LetDirective} from "@ngrx/component";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatFabButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {AuthStore} from "../../services/authentication/auth-store";
import {ApartmentStore} from "../../services/apartments-store.service";
import {AuthenticationRequest} from "../../domain/authentication-request";
import {CodeInputModule} from "angular-code-input";
import {TranslatePipe} from "@ngx-translate/core";
import {SetNewPasswordRequest} from "../../domain/set-new-password-request";


@Component({
    selector: 'forgot-password',
    imports: [
    FormsModule,
    LetDirective,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatFabButton,
    CodeInputModule,
    TranslatePipe,
    RouterLink
],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

    readonly router = inject(Router);
    readonly authStore = inject(AuthStore);
    readonly store = inject(ApartmentStore);

    authRequest: AuthenticationRequest = {email: '', password: ''};
    newPasswordRequest: SetNewPasswordRequest = {password: '', token: ''};
    isMobile$ = this.store.isMobile$;
    isEmailSent$ = this.store.isEmailSent$;

    showPassword: boolean = false;

    sendEmail() {
        this.store.recaptchaForgotPasswordEmail(this.authRequest.email);
    }

    changePassword() {
        if(this.newPasswordRequest.token.length === 6) {
            if(this.authRequest.password.length > 5 ){
                this.newPasswordRequest = {...this.newPasswordRequest, password: this.authRequest.password};
                this.store.recaptchaConfirmNewPassword(this.newPasswordRequest);
                //onSucess open conformation dialog, your password has ben change
                //on close dialog redirect to login
                this.router.navigate(['login']);
            }else{
                console.log("password no good");
            }
        }else{
            console.log("code not completed");
        }
    }

    onCodeCompleted(token: string) {
        this.newPasswordRequest = {...this.newPasswordRequest, token: token};
    }
}
