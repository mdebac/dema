import {Audit} from "./audit";
import {PanelIso} from "./panel-iso";

export interface Panel extends Audit{
    menuId: number;
    orderNum: number;
    panelUrl:string;
    icon:string;
    iso: PanelIso[];
    image: File | null;
    removeImage: boolean;
}
