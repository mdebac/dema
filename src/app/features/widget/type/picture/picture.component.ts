import {Component, Input} from '@angular/core';
import {ApartmentItem} from "../../../../domain/apartment-item";

@Component({
    selector: 'picture',
    templateUrl: './picture.component.html',
    styleUrl: './picture.component.scss'
})
export class PictureComponent {
  @Input() item:ApartmentItem;
  @Input() columns:number;
}
