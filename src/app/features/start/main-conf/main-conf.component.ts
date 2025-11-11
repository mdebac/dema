import {Component, Input} from '@angular/core';
import {Header} from "../../../domain/header";

@Component({
  selector: 'main-conf',
  imports: [],
  templateUrl: './main-conf.component.html',
  styleUrl: './main-conf.component.scss'
})
export class MainConfComponent {

  @Input() set header (data: Header | null) {

    if (data) {

      const variables = [
        '--primary-color: ' + data.colors.primaryColor + ';',
        '--secondary-color: ' + data.colors.secondaryColor + ';',
        '--danger-color: ' + data.colors.dangerColor + ';',
        '--warn-color: ' + data.colors.warnColor + ';',
        '--info-color: ' + data.colors.infoColor + ';',
        '--accept-color: ' + data.colors.acceptColor + ';',
        '--myIconImage:url(data:image/jpg;base64,' + data.main.iconImage + ');',
        '--myImageUrl: linear-gradient(to left, transparent, ' + data.colors.secondaryColor + ' ' + data.main.linearPercentage + '%),url(data:image/jpg;base64,' + data.main.backgroundImage + ');',
      ];

      if (data.main.iconImage) {
        const fav = document.createElement('link');
        fav.setAttribute('rel', 'icon');
        fav.setAttribute('sizes', '24x24');
        fav.setAttribute('href', 'data:image/jpg;base64,' + data.main.iconImage);
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
