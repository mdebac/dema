import {ApartmentComment} from "./apartment-comment";
import {ApartmentDetail} from "./apartment-detail";
import {User} from "./user";
import {Audit} from "./audit";
import {ApartmentIso} from "./apartment-iso";

export interface Apartment extends Audit {

  host: string;
  price: number | null;
  owner: User | null;
  detailId: number | null;
  rate: number | null;

  primaryColor: string | null;
  secondaryColor: string | null;
  primaryColorLight: string | null;
  secondaryColorLight: string | null;
  dangerColor: string | null;
  dangerColorLight: string | null;
  warnColor: string | null;
  warnColorLight: string | null;
  infoColor: string | null;
  infoColorLight: string | null;
  acceptColor: string | null;
  acceptColorLight: string | null;

  file: Blob | null;
  comments: ApartmentComment[];
  details: ApartmentDetail[];
  image: any;
  iso: ApartmentIso[];
}
