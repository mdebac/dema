import {Audit} from "./audit";

export interface Customer extends Audit {
    host: string;
    email: string;
    name: string;
    role: string;
}