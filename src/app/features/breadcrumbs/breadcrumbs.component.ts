import { Component } from '@angular/core';
import {Link} from "../../domain/link";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'breadcrumbs',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss'
})
export class BreadcrumbsComponent {
  breadcrumbs: Link[] | undefined;
}
//https://stackblitz.com/edit/stackblitz-starters-lgwtkw?file=src%2Fmain.scss  show menu
//https://www.youtube.com/watch?v=7d8UDEKT1pU
