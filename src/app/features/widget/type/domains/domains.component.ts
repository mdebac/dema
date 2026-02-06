import {Component, HostBinding, inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {LetDirective} from "@ngrx/component";
import {ApartmentStore} from "../../../../services/apartments-store.service";
import {QuillViewComponent} from "ngx-quill";
import {Apartment} from "../../../../domain/apartment";

@Component({
  selector: 'domains',
  imports: [
    LetDirective,
    QuillViewComponent
  ],
  templateUrl: './domains.component.html',
  styleUrl: './domains.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DomainsComponent implements OnInit{
  store = inject(ApartmentStore);
  pageCount$ = this.store.pageCount$;
  apartmentList$ = this.store.apartmentList$;

  @HostBinding("style.--domains-col")
  domainsCol: number = 1;
  @Input() set isMobile(isMobile:boolean){
    this.domainsCol = isMobile ? 1 : 4;
  }
  @Input() selectedIso:string = "";
  ngOnInit() {
    this.store.loadMyDomainsEffect();
  }

  goTo(url:string | undefined){
    window.open('https://' + url, '_blank');
  }
  getTitleMobile(country: string | null, domain: Apartment | undefined) {

    if (country && domain?.iso) {

      let text = domain?.iso?.find(iso => iso.iso === country)?.title

      if (text) {
        text = text +  domain.host;
        if (text.includes("6.25em")) {
          return text.replace("6.25em", "1.8em");
        }
        if (text.includes("4em")) {
          return text.replace("4em", "1.8em");
        }
        if (text.includes("2.5em")) {
          return text.replace("2.5em", "1.8em");
        }
        if (text.includes("2.3em")) {
          return text.replace("2.3em", "1.8em");
        }
        return text;

      }
      return domain.host;
    } else return "";
  }
}
