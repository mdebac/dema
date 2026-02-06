import {Component, Input, OnInit} from '@angular/core';
import {ApartmentItem} from "../../../../domain/apartment-item";
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
    selector: 'youtube',
    templateUrl: './youtube.component.html',
    styleUrl: './youtube.component.scss',
    imports: [YouTubePlayer]
})
export class YoutubeComponent implements OnInit {

  @Input() item: ApartmentItem | null = null;
  @Input() columns: number = 1;
  @Input() selectedIso: any;
  @Input() cornerRadius: any;
  @Input() isMobile: boolean = true;

  ngOnInit() {
    const scriptTag = document.createElement('script');
    scriptTag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(scriptTag);
  }


  get width(): number {

    if(this.isMobile){
return 200;
    }else{
      if (this.columns === 1) {
        return 1350;
      }else if (this.columns === 2) {
        return 655;
      }else if (this.columns === 3) {
        return 430;
      }else{
        return 320;
      }
    }

  }

  get height(): number {

    if(this.isMobile){
      return 200;
    }else{
      if (this.columns === 1) {
        return 800;
      } else if (this.columns === 2) {
        return 420;
      } else if (this.columns === 3) {
        return 430;
      } else {
        return 400;
      }
    }

  }

}
