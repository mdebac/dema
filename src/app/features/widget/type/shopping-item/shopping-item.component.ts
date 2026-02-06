import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ApartmentItem} from "../../../../domain/apartment-item";
import {Chip} from "../../../../domain/chip.enum";
import {TextComponent} from "../text/text.component";

@Component({
    selector: 'shopping',
    templateUrl: './shopping-item.component.html',
    imports: [
        TextComponent
    ],
    styleUrl: './shopping-item.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class ShoppingItemComponent {
    @Input() item:ApartmentItem | null | undefined = null;
    @Input() columns:number = 1;
    @Input() selectedIso:string = "";

    protected readonly Chip = Chip;
}
