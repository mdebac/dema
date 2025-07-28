import {Component, Input} from "@angular/core";
import {SlideInterface} from "../imageSlider/types/slide.interface";
import { ImageSliderComponent } from "../imageSlider/components/imageSlider/imageSlider.component";

@Component({
    selector: 'photo-show',
    templateUrl: './photo-show.component.html',
    styleUrls: ['./photo-show.component.scss'],
    imports: [ImageSliderComponent],
})
export class PhotoShowComponent {

  @Input() slides: SlideInterface[];

}
