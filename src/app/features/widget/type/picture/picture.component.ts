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
    @Input() item: ApartmentItem | null | undefined = null;
    @Input() columns: number = 1;
    @Input() selectedIso: string = "";
    @Input() isMobile: boolean = true;
    @HostBinding("style.--cornerRadius")
    @Input() cornerRadius: any = "";

    @HostBinding("style.--imageAlignVertical")
    @Input() imageAlignVertical: any = "";

    @HostBinding("style.--imageAlignHorizontal")
    @Input() imageAlignHorizontal: any = "";

    @HostBinding("style.--imageHeight")
    get imageHeight() {
        return this.item?.imageHeight + '%';
    }

    @HostBinding("style.--imageWidth")
    get imageWidth() {
        return this.item?.imageWidth + '%';
    }

    protected readonly Chip = Chip;
}
