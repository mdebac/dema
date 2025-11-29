import {Component, HostBinding, Input, ViewEncapsulation} from '@angular/core';
import {ApartmentItem} from "../../../../domain/apartment-item";
import {Chip} from "../../../../domain/chip.enum";
import {TextComponent} from "../text/text.component";

@Component({
    selector: 'picture',
    templateUrl: './picture.component.html',
    imports: [
        TextComponent
    ],
    styleUrl: './picture.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class PictureComponent {
  @Input() item:ApartmentItem | null | undefined = null;
  @Input() columns:number = 1;
  @Input() selectedIso:string = "";
  @HostBinding("style.--cornerRadius")
  @Input() cornerRadius:any = "";

  protected readonly Chip = Chip;
}
