export interface Colors{
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


  /*
  primaryColorLight$: primaryColorLight$ = this.store.primaryColorLight$.pipe(filter((e) => !!e));
  secondaryColorLight$: secondaryColorLight$ = this.store.secondaryColorLight$.pipe(filter((e) => !!e));
  dangerColor$: dangerColor$ = this.store.dangerColor$.pipe(filter((e) => !!e));
  dangerColorLight$: dangerColorLight$ = this.store.dangerColorLight$.pipe(filter((e) => !!e));
  warnColor$: warnColor$ = this.store.warnColor$.pipe(filter((e) => !!e));
  warnColorLight$: warnColorLight$ = this.store.warnColorLight$.pipe(filter((e) => !!e));
  infoColor$: infoColor$ = this.store.infoColor$.pipe(filter((e) => !!e));
  infoColorLight$: infoColorLight$ = this.store.infoColorLight$.pipe(filter((e) => !!e));
  acceptColor$: infoColor$ = this.store.infoColor$.pipe(filter((e) => !!e));
  acceptColorLight$: infoColorLight$ = this.store.infoColorLight$.pipe(filter((e) => !!e));
  */
}
