import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {ApartmentsHttpService} from "./services/apartments-http.service";
import {MainComponent} from "./features/main/main.component";
import {CommonModule} from "@angular/common";

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [ApartmentsHttpService]
})
export class AppComponent {
    title = 'dema 2';
}
