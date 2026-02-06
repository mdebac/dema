import {Component, Input} from '@angular/core';
import {Header} from "../../../domain/header";

@Component({
  selector: 'main-conf',
  imports: [],
  templateUrl: './main-conf.component.html',
  styleUrl: './main-conf.component.scss'
})
export class MainConfComponent {

  @Input() set header (data: any | null) {

    if (data.header) {

      const iconImage = data.image ? data.image : data.header.main.iconImage
      const variables = [
        '--primary-color: ' + data.header.main.primaryColor + ';',
        '--secondary-color: ' + data.header.main.secondaryColor + ';',
        '--danger-color: ' + data.header.main.dangerColor + ';',
        '--warn-color: ' + data.header.main.warnColor + ';',
        '--info-color: ' + data.header.main.infoColor + ';',
        '--accept-color: ' + data.header.main.acceptColor + ';',
        '--myIconImage:url(data:image/jpg;base64,' + iconImage + ');',
        '--myImageUrl: linear-gradient(to left, transparent, ' + data.header.main.secondaryColor + ' ' + data.header.main.linearPercentage + '%),url(data:image/jpg;base64,' + data.header.main.backgroundImage + ');',
      ];

      if (data.header.main.iconImage) {
        const fav = document.createElement('link');
        fav.setAttribute('rel', 'icon');
        fav.setAttribute('sizes', '24x24');
        fav.setAttribute('href', 'data:image/jpg;base64,' + data.header.main.iconImage);
        document.head.appendChild(fav);
      }

      const cssVariables = `:root{ ${variables.join('')}}`;
      const blob = new Blob([cssVariables]);
      const url = URL.createObjectURL(blob);
      const cssElement = document.createElement('link');
      cssElement.setAttribute('rel', 'stylesheet');
      cssElement.setAttribute('type', 'text/css');
      cssElement.setAttribute('href', url);
      document.head.appendChild(cssElement);
    }

  }

}
