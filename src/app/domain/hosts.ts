export enum Hosts {
  ADRIATICSUN_EU="adriaticsun.eu",
  DEMA_APARTMENTS="dema-apartments.eu",
  INFO_DEMA_EU="info-dema.eu",
  DEV_NEWS_EU="dev-news.eu",
}

export function getHostsByKeyForStringEnum(value: string) {
  return Object.entries(Hosts).find(([key, val]) => key === value)?.[1];
}

//https://www.technicalfeeder.com/2021/07/mastering-enum-in-typescript/
