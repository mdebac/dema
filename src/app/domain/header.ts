import {Menu} from "./menu";
import {ApartmentIso} from "./apartment-iso";
import {Colors} from "./colors";
import {Hosts} from "./hosts";

export interface Header{
  id:number;
  iconImage: File;
  backgroundImage: File;
  linearPercentage: number;
  languages: string[];
  menus: Menu[];
  activeDetailUrl:string;
  activePanelUrl:string;
  iso: ApartmentIso [];
  colors: Colors;
  host: Hosts;
}


