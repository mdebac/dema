import {Component, Input, ViewEncapsulation} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {Header} from "../../domain/header";
import {TopMenuComponent} from "../top-menu/top-menu.component";

@Component({
  selector: 'mobile-top-menu',
    imports: [
        MatButton,
        MatIcon,
        MatMenu,
        MatMenuTrigger,
        TopMenuComponent,
    ],
  templateUrl: './mobile-top-menu.component.html',
  styleUrl: './mobile-top-menu.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class MobileTopMenuComponent {

    @Input() canEdit: boolean = false;
    @Input() header: Header | null = null
    @Input() selectedIso: string | null | undefined = "";

}
