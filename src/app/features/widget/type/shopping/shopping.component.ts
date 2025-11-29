import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ApartmentItem} from "../../../../domain/apartment-item";
import {ApartmentItemIso} from "../../../../domain/apartment-item-iso";
import {Chip} from "../../../../domain/chip.enum";
import {TextComponent} from "../text/text.component";

@Component({
    selector: 'shopping',
    templateUrl: './shopping.component.html',
    imports: [
        TextComponent
    ],
    styleUrl: './shopping.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class ShoppingComponent {
    @Input() item:ApartmentItem | null | undefined = null;
    @Input() columns:number = 1;
    @Input() selectedIso:string = "";

    protected readonly Chip = Chip;
}
