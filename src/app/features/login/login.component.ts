import {Component} from '@angular/core';
import {Router} from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthenticationRequest} from "../../domain/authentication-request";
import {AuthenticationService} from "../../services/authentication.service";
import {TokenService} from "../../services/token.service";
import {AuthStore} from "../../services/authentication/auth-store";
import {MatCard, MatCardContent, MatCardFooter, MatCardHeader} from "@angular/material/card";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        NgIf,
        NgFor,
        FormsModule,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardFooter,
    ],
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
    private authStore: AuthStore
  ) {
  }

  login() {
    this.errorMsg = [];

    this.authStore.login(this.authRequest.email, this.authRequest.password).subscribe(
        () => {
            //     this.tokenService.token = res.token as string;
                   this.router.navigate(['']);
               }
    );

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

  register() {
    this.router.navigate(['register']);
  }
}
