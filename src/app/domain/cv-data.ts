import {Audit} from "./audit";

export interface CvData extends Audit{
  //candidate data
  name: string;
  email: string;
  coverLetterText: string;
  itemId: number;
  //file data
  fileName: string;
  mimeType: string;
  size: number;
  content: any;

  captchaResponse: string;
}
