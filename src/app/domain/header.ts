import {Menu} from "./menu";
import {Apartment} from "./apartment";


export interface Header{
  menus: Menu[];
  activeTopMenuUrl:string;
  activeSideMenuUrl:string;
  main: Apartment;
}

/*
//                .id(entity.getId())
                //                .linearPercentage(entity.getLinearPercentage() != null ? entity.getLinearPercentage() : 0)
//                .host(entity.getHost())
//                .backgroundImage(entity.getContentBackground())
//                .iconImage(entity.getContent())

 */
