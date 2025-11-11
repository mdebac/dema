import {Menu} from "./menu";
import {ApartmentIso} from "./apartment-iso";
import {Colors} from "./colors";
import {Apartment} from "./apartment";

export interface Header{
  languages: string[];
  menus: Menu[];
  activeTopMenuUrl:string;
  activeSideMenuUrl:string;
  iso: ApartmentIso [];
  colors: Colors;
  main: Apartment;
}

/*
//                .id(entity.getId())
                //                .linearPercentage(entity.getLinearPercentage() != null ? entity.getLinearPercentage() : 0)
//                .host(entity.getHost())
//                .backgroundImage(entity.getContentBackground())
//                .iconImage(entity.getContent())

 */
