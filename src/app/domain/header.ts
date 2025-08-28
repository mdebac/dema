import {HeaderDetail} from "./header-detail";
import {ApartmentIso} from "./apartment-iso";
import {Colors} from "./colors";
import {Hosts} from "./hosts";

export interface Header{
  iconImage: any;
  backgroundImage: any;
  linearPercentage: number;
  languages: string[];
  detail: HeaderDetail[];
//  apartmentUrl:string;
  activeDetailUrl:string;
  iso: ApartmentIso [];
  colors: Colors;
  host: Hosts;

  /*primaryColor$: primaryColor$ = this.store.primaryColor$.pipe(filter((e) => !!e));
primaryColorLight$: primaryColorLight$ = this.store.primaryColorLight$.pipe(filter((e) => !!e));
secondaryColor$: secondaryColor$ = this.store.secondaryColor$.pipe(filter((e) => !!e));
secondaryColorLight$: secondaryColorLight$ = this.store.secondaryColorLight$.pipe(filter((e) => !!e));
dangerColor$: dangerColor$ = this.store.dangerColor$.pipe(filter((e) => !!e));
dangerColorLight$: dangerColorLight$ = this.store.dangerColorLight$.pipe(filter((e) => !!e));
warnColor$: warnColor$ = this.store.warnColor$.pipe(filter((e) => !!e));
warnColorLight$: warnColorLight$ = this.store.warnColorLight$.pipe(filter((e) => !!e));
infoColor$: infoColor$ = this.store.infoColor$.pipe(filter((e) => !!e));
infoColorLight$: infoColorLight$ = this.store.infoColorLight$.pipe(filter((e) => !!e));
acceptColor$: infoColor$ = this.store.infoColor$.pipe(filter((e) => !!e));
acceptColorLight$: infoColorLight$ = this.store.infoColorLight$.pipe(filter((e) => !!e));
*/
}


