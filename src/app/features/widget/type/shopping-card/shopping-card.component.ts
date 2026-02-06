import {Component, Input} from '@angular/core';
import {MakePaymentComponent} from "../../../shopping/make-payment/make-payment.component";
import {ApartmentItem} from "../../../../domain/apartment-item";
import {User} from "../../../../domain/user";
import {Customer} from "../../../../domain/customer";


@Component({
    selector: 'shopping',
    templateUrl: './shopping-card.component.html',
    imports: [
        MakePaymentComponent
    ],
    styleUrl: './shopping-card.component.scss'
})
export class ShoppingCardComponent {
    @Input() item:ApartmentItem | null | undefined = null;
    @Input() selectedIso:string = "";
    @Input() user: Customer | undefined;
}
