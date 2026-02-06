export enum Hosts {
  ADRIATICSUN_EU="adriaticsun.eu",
  VILLA_DUBRAVKA_SAMOBOR_COM="villa-dubravka-samobor.com",
  CANNABIS_OIL_SHOP="cannabis-oil.shop",
  DEMA_APARTMENTS="dema-apartments.eu",
  INFO_DEMA_EU="info-dema.eu",
  DEV_NEWS_EU="dev-news.eu",
  INFO_DEMA_TEST1_COM="info-dema-test1.com",
  RESIDENCE_INFO_DEMA_EU="residence.info-dema.eu"
}


export function getHostsByKeyForStringEnum(value: string) {
  return Object.entries(Hosts).find(([key, val]) => key === value)?.[1];
}

//https://www.technicalfeeder.com/2021/07/mastering-enum-in-typescript/
