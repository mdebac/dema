import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Router} from '@angular/router';

import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {RegistrationRequest} from "../../domain/registration-request";
import {AuthenticationService} from "../../services/authentication.service";
import {Colors} from "../../domain/colors";
import {ApartmentStore} from "../../services/apartments-store.service";

@Component({
    selector: 'dema-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [
        NgIf,
        NgFor,
        FormsModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

  registerRequest: RegistrationRequest = {email: '', firstname: '', lastname: '', password: '', host: ''};
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
      console.log("RegisterComponent ngOnInit")
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest
    })
      .subscribe({
        next: () => {
          this.router.navigate(['activate-account']);
        },
        error: (err) => {
          this.errorMsg = err.error.validationErrors;
        }
      });
  }
}
