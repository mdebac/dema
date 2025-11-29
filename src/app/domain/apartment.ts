import {ApartmentComment} from "./apartment-comment";
import {ApartmentDetail} from "./apartment-detail";
import {User} from "./user";
import {Audit} from "./audit";
import {ApartmentIso} from "./apartment-iso";
import {Customer} from "./customer";
import {MatTableDataSource} from "@angular/material/table";
import {Hosts} from "./hosts";
import {Font} from "./font";
import {Language} from "./language";
import {Colors} from "./colors";

export interface Apartment extends Audit {

  host: Hosts;
  price: number | null;
  owner: User | null;
  detailId: number | null;
  //rate: number | null;
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
  removePicture: boolean;
  removePictureBackground: boolean;
  linearPercentage: number;
  colors: Colors;
  file: Blob | null;
  comments: ApartmentComment[];
  details: ApartmentDetail[];
  iconImage: File | null;
  backgroundImage: File | null;
  iso: ApartmentIso[];
  fonts: Font[];
  languages: Language[];
  customers: Customer[];
  customersDS?: MatTableDataSource<Customer>;
}
