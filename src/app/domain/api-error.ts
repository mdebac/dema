export interface ApiError{

  message: string;
  status:string;
  requestId:string;
  debugMessage:string;
  subErrors:string[];

  path:string;

}
