import {Menu} from "./menu";
import {ApartmentIso} from "./apartment-iso";
import {Colors} from "./colors";
import {Apartment} from "./apartment";
import {Font} from "./font";
import {Language} from "./language";

export interface Header{
  menus: Menu[];
  activeTopMenuUrl:string;
  activeSideMenuUrl:string;
  //colors: Colors;
  main: Apartment;
}

/*
//                .id(entity.getId())
                //                .linearPercentage(entity.getLinearPercentage() != null ? entity.getLinearPercentage() : 0)
//                .host(entity.getHost())
//                .backgroundImage(entity.getContentBackground())
//                .iconImage(entity.getContent())

 */
