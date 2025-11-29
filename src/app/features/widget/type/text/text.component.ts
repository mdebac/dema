import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {ApartmentItemIso} from "../../../../domain/apartment-item-iso";

import { FormsModule } from '@angular/forms';
import {QuillViewComponent} from "ngx-quill";

@Component({
    selector: 'text',
    templateUrl: './text.component.html',
    styleUrl: './text.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [FormsModule, QuillViewComponent]
})
export class TextComponent{
  @Input() item:ApartmentItemIso[] | null | undefined = [];
  @Input() selectedIso:string = "";
  @Input() columns:number = 1;

  getDescription(country: string | null, iso: ApartmentItemIso[] | undefined | null) {
    return iso?.find(iso => iso.iso === country)?.description;
  }
}
