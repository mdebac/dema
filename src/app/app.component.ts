import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {ApartmentsHttpService} from "./services/apartments-http.service";

import {NavigationComponent} from "./features/navigation/navigation.component";

@Component({
    selector: 'app-root',
    imports: [NavigationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [ApartmentsHttpService]
})
export class AppComponent {
    title = 'dema 2';
}
