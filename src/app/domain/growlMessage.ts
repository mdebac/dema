
export interface GrowlMessage{

  summary?: string,
  detail?: string,

  //warning,danger, info
  severity?: string,
  life?: number,

}
