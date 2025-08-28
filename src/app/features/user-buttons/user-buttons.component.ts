import {Component, inject, Input} from '@angular/core';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatMenuTrigger, MatMenu} from '@angular/material/menu';
import {MatIcon} from "@angular/material/icon";
import {RouterLinkActive} from "@angular/router";
import {AuthStore} from "../../services/authentication/auth-store";

@Component({
    selector: 'user-buttons',
    templateUrl: './user-buttons.component.html',
    styleUrl: './user-buttons.component.scss',
    imports: [ MatButton, MatMenuTrigger,  MatMenu, MatIcon, MatFabButton,  RouterLinkActive]
})
export class UserButtonsComponent {

    authStore = inject(AuthStore);

    @Input() user: any;

    logout() {
        //   localStorage.removeItem('token');
        this.authStore.logout();
        //  window.location.reload();
    }

}
