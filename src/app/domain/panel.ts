import {Audit} from "./audit";
import {PanelIso} from "./panel-iso";
import {Chip} from "./chip.enum";
import {SideMenuType} from "./side-menu-type";

export interface Panel extends Audit{
    menuId: number;

    orderNum: number;
    beforeId:number;
    nextId:number;
    chip: Chip

    panelUrl:string;
    icon:string;
    iso: PanelIso[];
    image: File | null;
    removeImage: boolean;
    type: SideMenuType;
}
