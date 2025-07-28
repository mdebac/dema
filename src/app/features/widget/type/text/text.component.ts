import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {ApartmentItemIso} from "../../../../domain/apartment-item-iso";
import { Editor, NgxEditorComponent } from "ngx-editor";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'text',
    templateUrl: './text.component.html',
    styleUrl: './text.component.scss',
    imports: [NgxEditorComponent, FormsModule]
})
export class TextComponent implements OnInit, OnDestroy {
  @Input() item:ApartmentItemIso[];
  @Input() selectedIso:string;
  @Input() columns:number;

  editor: Editor;

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  getDescription(country: string | null, iso: ApartmentItemIso[] | undefined) {
    return iso?.find(iso => iso.iso === country)?.description;
  }
  getTitle(country: string | null, iso: ApartmentItemIso[] | undefined) {
    return iso?.find(iso => iso.iso === country)?.title;
  }
}
