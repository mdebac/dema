import { Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import {SlideInterface} from "../imageSlider/types/slide.interface";
import {PhotoShowComponent} from "../photo-show/photo-show.component";

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
    imports: [
        MatCard,
        MatCardHeader,
        MatCardContent,
        PhotoShowComponent,
    ],
})
export class CalendarComponent {

  slides: SlideInterface[] = [
    { url: '/assets/dubrovnik2.jpg', title: 'beach' },
    { url: '/assets/dubrovnik1.png', title: 'boat' },
    { url: '/assets/dubrovnik3.png', title: 'boat' },
  ];

}
