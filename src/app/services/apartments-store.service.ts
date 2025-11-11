import {inject, Injectable} from "@angular/core";
import {Apartment} from "../domain/apartment";
import {catchError, EMPTY, finalize, Observable, switchMap, tap, withLatestFrom} from "rxjs";
import {ApartmentCriteria} from "../domain/apartment-criteria";
import {ComponentStore} from '@ngrx/component-store';
import {ApiError} from "../domain/api-error";
import {tapResponse} from "@ngrx/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {filter} from "rxjs/operators";
import {Router} from "@angular/router";
import {ApartmentDetail} from "../domain/apartment-detail";
import {ApartmentItem} from "../domain/apartment-item";
import {Header} from "../domain/header";
import {TranslateService} from "@ngx-translate/core";
import {Colors} from "../domain/colors";
import {ApartmentsHttpService} from "./apartments-http.service";
import {Page} from "../util/search-criteria";
import {Chip} from "../domain/chip.enum";
import {MatTableDataSource} from "@angular/material/table";
import {ActiveMenu} from "../domain/active-menu";
import {Menu} from "../domain/menu";
import {Layout, layoutMap} from "../domain/layout";
import {Side} from "../domain/side";
import {LayoutState} from "../domain/layout-state";
import {ReCaptchaV3Service} from "ng-recaptcha-2";

export interface ApartmentState {
    page: Page<Apartment>;

    selectedDetailPageLabel: string | null,

    selectedIso: string | null,

    generatedUrl: string | null,
    generatedDetailedUrl: string | null,

    paginationPage: number,
    paginationSize: number,
    paginationSort: string,

    selectedDetailPage: ApartmentDetail | null,
    header: Header | null,
    //   loadHeader: boolean,
    headerLoading: boolean,

    activeTopMenuUrl: string | null;
    activeSideMenuUrl: string | null;

    segment: string | null;
    selectedApartmentId: number | null,

    filterChip: Chip | null;
    filterTitle: string | null;

    footerVisible: boolean,

    shrinkMenu: boolean,
    isMobile: boolean,
    isEmailSent: boolean,

    loading: boolean;
    error: ApiError | null;
}

export const initialApartmentState: ApartmentState = {
    page: Page.empty(),

    selectedDetailPageLabel: null,
    selectedDetailPage: null,
    selectedApartmentId: null,

    generatedUrl: null,
    generatedDetailedUrl: null,

    selectedIso: null,
    loading: false,
    header: null,
    //   loadHeader: false,
    headerLoading: false,
    activeTopMenuUrl: null,
    activeSideMenuUrl: null,
    segment: null,

    filterChip: null,
    filterTitle: null,
    paginationPage: 0,
    paginationSize: 20,
    paginationSort: 'created_on,DESC',
    shrinkMenu: true,
    isMobile: false,
    isEmailSent: false,

    footerVisible: false,

    error: null,
};

@Injectable()
export class ApartmentStore extends ComponentStore<ApartmentState> {
    readonly service = inject(ApartmentsHttpService);
    readonly router = inject(Router);
    readonly translateService = inject(TranslateService);
    readonly recaptchaV3Service = inject(ReCaptchaV3Service);

    apartmentsPage$: Observable<Page<Apartment>> = this.select((state) => state.page);
    loading$: Observable<boolean> = this.select((state) => state.loading);
    error$: Observable<ApiError | null> = this.select((state) => state.error);
    paginationPage$: Observable<number> = this.select((state) => state.paginationPage);
    paginationSize$: Observable<number> = this.select((state) => state.paginationSize);
    paginationSort$: Observable<string> = this.select((state) => state.paginationSort);
    filterChip$: Observable<Chip | null> = this.select((state) => state.filterChip);
    filterTitle$: Observable<string | null> = this.select((state) => state.filterTitle);
    selectedDetailPage$: Observable<ApartmentDetail | null> = this.select((state) => state.selectedDetailPage);
    activeTopMenuUrl$: Observable<string | null> = this.select((state) => state.activeTopMenuUrl);
    activeSideMenuUrl$: Observable<string | null> = this.select((state) => state.activeSideMenuUrl);
    header$: Observable<Header | null> = this.select((state) => state.header);
    shrinkMenu$: Observable<boolean> = this.select((state) => state.shrinkMenu);
    isMobile$: Observable<boolean> = this.select((state) => state.isMobile);
    selectedIso$: Observable<string | null> = this.select((state) => state.selectedIso);
    isEmailSent$: Observable<boolean> = this.select((state) => state.isEmailSent);
    footerVisible$: Observable<boolean> = this.select((state) => state.footerVisible);

    menuPanelVisible$: Observable<boolean> = this.select(
        this.selectedDetailPage$,
        (detail) => {
            if (!detail?.topMenu.hideMenuPanelIfOne) {
                return true;
            } else {
                if (detail?.topMenu?.panels?.length ? detail?.topMenu?.panels?.length < 2 : false) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    );

    activeMenu$: Observable<ActiveMenu> = this.select(
        this.header$,
        this.activeTopMenuUrl$,
        this.activeSideMenuUrl$,
        (header, top, side) => {

            if (top) {
                return {top: top, side: side} as ActiveMenu;
            } else {
                return {top: header?.activeTopMenuUrl, side: header?.activeSideMenuUrl} as ActiveMenu;
            }
        }
    );

    columns$: Observable<number> = this.select(
        this.selectedDetailPage$,
        this.isMobile$,
        (page, isMobile) => {
            if (isMobile) {
                return 1;
            } else {
                if (page && page.columns) {
                    return page?.columns;
                } else {
                    return 1;
                }
            }
        }
    );

    hideMenuPanelIfOne$: Observable<boolean> = this.select(
        this.selectedDetailPage$,
        (page) => {
            if (page && page.topMenu.hideMenuPanelIfOne) {
                return page?.topMenu.hideMenuPanelIfOne;
            } else {
                return false;
            }
        }
    );


    disableAddingNewPanels$: Observable<boolean> = this.select(
        this.selectedDetailPage$,
        (page) => {

            return !(page?.topMenu?.panels?.length ? page?.topMenu?.panels?.length > 5 : true);

        }
    );

    // onlyOne(menus: Menu[] | undefined) {
    //     if (menus) {
    //         if (menus.length) {
    //             if (menus.length < 2) {
    //                 return menus[0].panels.length < 2;
    //             } else {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }

    panelOn$: Observable<boolean> = this.select(
        this.selectedDetailPage$,
        (page) => {
            if (page && page.topMenu.panelOn) {
                return page?.topMenu.panelOn;
            } else {
                return false;
            }
        }
    );

    side$: Observable<Side> = this.select(
        this.selectedDetailPage$,
        (page) => {
            if (page && page.topMenu.side) {
                return page?.topMenu.side;
            } else {
                return Side.LEFT;
            }
        }
    );

    layout$: Observable<Layout> = this.select(
        this.selectedDetailPage$,
        (page) => {
            if (page && page.topMenu.layout) {
                return page?.topMenu.layout;
            } else {
                return Layout.FULL;
            }
        }
    );

    cornerRadius$: Observable<number> = this.select(
        this.selectedDetailPage$,
        (page) => {
            if (page && page.cornerRadius) {
                return page?.cornerRadius;
            } else {
                return 32;
            }
        }
    );

    cornerRadiusPanel$: Observable<number> = this.select(
        this.selectedDetailPage$,
        (page) => {
            if (page && page.cornerRadiusPanel) {
                return page?.cornerRadiusPanel;
            } else {
                return 32;
            }
        }
    );

    colors$: Observable<Colors | null> = this.select(
        this.header$,
        (header) => {
            if (header?.colors) {
                return header.colors;
            } else return null;
        }
    );

    //TODO pagination
    apartmentCriteria$: Observable<ApartmentCriteria> = this.select(
        this.filterChip$,
        this.filterTitle$,
        this.paginationPage$,
        this.paginationSize$,
        this.paginationSort$,
        (chip, title, page, size, sort) => {
            return {chip, title, page, size, sort} as ApartmentCriteria;
        }
    );

    apartmentList$: Observable<Apartment[]> = this.select(
        this.apartmentsPage$,
        (page) => {
            return page.content;
        }
    );

    pageCount$: Observable<number> = this.select(
        this.apartmentsPage$,
        (page) => {
            return page.content.length;
        }
    );

    backgroundColorSummer$: Observable<string> = this.select(
        this.selectedDetailPage$,
        (detail) => {
            if (detail?.backgroundColor) {
                return detail.backgroundColor;
            } else {
                return "";
            }
        }
    );


    backgroundColorPanel$: Observable<string> = this.select(
        this.selectedDetailPage$,
        (detail) => {
            if (detail?.backgroundColor) {
                //TODO
                return "";//detail.menu.backgroundColor;
            } else {
                return "";
            }
        }
    );


    actionsBorderColorSummer$: Observable<string> = this.select(
        this.backgroundColorSummer$,
        this.header$,
        (color, header) => {
            if (header?.colors?.primaryColor && header?.colors?.secondaryColor) {
                return color === header?.colors?.primaryColor ? header?.colors?.secondaryColor : header?.colors?.primaryColor;
            } else {
                return "";
            }
        }
    );

    actionsBorderColorPanel$: Observable<string> = this.select(
        this.backgroundColorPanel$,
        this.header$,
        (color, header) => {
            if (header?.colors?.primaryColor && header?.colors?.secondaryColor) {
                return color === header?.colors?.primaryColor ? header?.colors?.secondaryColor : header?.colors?.primaryColor;
            } else {
                return "";
            }
        }
    );

    stateLayout$: Observable<LayoutState | undefined> = this.select(
        this.side$,
        this.layout$,
        this.hideMenuPanelIfOne$,
        this.panelOn$,
        this.shrinkMenu$,
        this.isMobile$,
        (side, layout, hideMenuPanelOn, panelOn, shrinkedMenu, isMobile) => {

            const sN: number = side === Side.LEFT ? 0 : 1;
            const lN: number = layout === Layout.CENTER ? 0 : 1;
            const hN: number = hideMenuPanelOn ? 1 : 0;
            const pN: number = panelOn ? 1 : 0;
            const shN: number = shrinkedMenu ? 1 : 0;

            if (isMobile) {
                return {gapL: 0, panelL: 0, menuL: 0, center: 20, menuR: 0, panelR: 0, gapR: 0};
            } else {
                const key = sN + "," + lN + "," + hN + "," + pN + "," + shN;
                return layoutMap.get(key);
            }
        }
    );


    //TODO pagination filter for apartman
    loadApartmentsByFilterEffect = this.effect(
        (criteria$: Observable<ApartmentCriteria>) => criteria$.pipe(
            tap(() => this.patchState({loading: true})),
            switchMap(
                (criteria) => this.service.searchApartments(criteria)
                    .pipe(
                        tapResponse({
                            next: (response: Page<Apartment>) => this.patchState({page: response}),
                            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => this.patchState({loading: false}))
                    ),
            ),
        )
    );

    readonly loadDetailByRouteLabelsEffect = this.effect(
        (activeMenu$: Observable<ActiveMenu | null>) => activeMenu$.pipe(
            withLatestFrom(
                this.header$,
                //   this.loadHeader$,
            ),
            tap(([activeMenu, header]) => {
                console.log("(effect) loadDetailByRouteLabelsEffect activeDetailUrl", activeMenu);
                console.log("(effect) loadDetailByRouteLabelsEffect header", header);
            }),
            switchMap(([activeMenu, header]) =>
                this.service.fetchDetailByRouteLabels(header, activeMenu?.top, activeMenu?.side)
                    .pipe(
                        tapResponse({
                            next: (response: ApartmentDetail | null) => {
                                this.patchState({selectedDetailPage: response})
                                // if (loadHeader) {
                                //     this.loadHeaderByHost();
                                //    // this.setLoadHeader(false);
                                // }
                            },
                            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => this.patchState({loading: false}))
                    )
            ),
        )
    );

    loadHeaderByHost = this.effect(
        _ => _.pipe(
            withLatestFrom(
                this.activeMenu$,
            ),
            tap(([_, activeMenu]) => {
                console.log("(effect) loadHeaderByHost activeMenu", activeMenu);
            }),
            switchMap(([_, activeMenu]) => this.service.fetchHeader()
                .pipe(
                    tapResponse({
                        next: (response: Header) => {
                            this.patchState({header: response});
                            //    this.loadDetailByRouteLabelsEffect(response);
                        },
                        error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                    }),
                    catchError(() => EMPTY),
                    finalize(() => this.patchState({loading: false}))
                )
            ),
        ));

    loadCustomersEffect = this.effect(
        _ => _.pipe(
            switchMap(
                (_) => this.service.myCustomers()
                    .pipe(
                        tapResponse({
                            next: (response: Page<Apartment>) => {

                                response.content.forEach(
                                    a => {
                                        a.customersDS = new MatTableDataSource(a.customers);
                                    }
                                );
                                this.patchState({page: response})
                            },
                            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => this.patchState({loading: false}))
                    )),
        ),
    );

    loadMyDomainsEffect = this.effect(
        _ => _.pipe(
            withLatestFrom(
                this.header$,
            ),
            switchMap(
                ([_, header]) => this.service.myDomains()
                    .pipe(
                        tapResponse({
                            next: (response: Page<Apartment>) => {
                                response.content.forEach(
                                    a => {
                                        a.customersDS = new MatTableDataSource(a.customers);
                                    }
                                );
                                this.patchState({page: response})
                            },
                            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => this.patchState({loading: false}))
                    )),
        ),
    );

    readonly createMainEffect = this.effect(
        (main$: Observable<Partial<Apartment>>) => main$.pipe(
            tap((main) => {
                console.log("(effect) create Main Effect", main);
            }),
            switchMap(
                (main) => this.service.createMain(main)
                    .pipe(
                        tap({
                            next: (response: Header) => this.patchState({header: response}),
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    /*

        this.recaptchaV3Service.execute('importantAction').subscribe((token) => {
            this.store.sendForgotPasswordEmailEffect(this.authRequest.email, token)
                .pipe(first())
                .subscribe({
                    next: (response) => {
                        this.errorResponse = 'Registration successful';
                        localStorage.setItem('user', JSON.stringify(response.data));
                        this.router.navigate(['/home']);
                    },
                    error: (error: any) => {
                        var response = <ApiResponse>error.error;
                        this.errorResponse = response.message;
                        this.loading = false;
                    }
                });
        });
     */

    readonly sendForgotPasswordEmailEffect = this.effect(
        (email$: Observable<string>) => email$.pipe(
            filter((email) => !!email || email.length < 1),
            switchMap((email) =>
                this.recaptchaV3Service.execute('importantAction')
                    .pipe(
                        tap({
                            next: (token) =>
                                this.patchState({isEmailSent: true}),
                            error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY)
                    )
            ),
        ));

    readonly sendForgotEmailPasswordWithToken = this.effect((params$: Observable<{
        email: string;
        token: string
    }>) => params$.pipe(
        switchMap(({email, token}) => this.service.sendForgotPasswordEmail(email, token).pipe(
            tapResponse(
                () => this.patchState({isEmailSent: true}),
                (error: HttpErrorResponse) =>
                    this.patchState({error: error.error}),
            ),
            catchError(() => EMPTY),
            finalize(() => {
                },
            )),
        ),
    ));

    readonly confirmNewPassword = this.effect((params$: Observable<{
        password: string;
        token: string;
        captcha: string
    }>) => params$.pipe(
        switchMap(({password, token, captcha}) => this.service.confirmNewPassword(password, token, captcha).pipe(
            tapResponse(
                () => console.log("password has been changed notification"),
                (error: HttpErrorResponse) =>
                    this.patchState({error: error.error}),
            ),
            catchError(() => EMPTY),
            finalize(() => this.patchState({isEmailSent: false}),
            )),
        ),
    ));


    readonly recaptchaConfirmNewPassword =
        this.effect((params$: Observable<{
            password: string;
            token: string;
        }>) => params$.pipe(
            switchMap(({password, token}) =>
                this.recaptchaV3Service.execute('importantAction')
                    .pipe(
                        tap({
                            next: (captcha: string) => this.confirmNewPassword({password, token, captcha}),
                            error: (error) => console.log("recaptchaConfirmNewPassword error", error),
                        }),
                        catchError(() => EMPTY)
                    )
            ),
        ));


    readonly recaptchaForgotPasswordEmail = this.effect(
        (email$: Observable<string>) => email$.pipe(
            filter((email) => !!email && email.length > 0),
            switchMap((email) =>
                this.recaptchaV3Service.execute('importantAction')
                    .pipe(
                        tap({
                            next: (token: string) => this.sendForgotEmailPasswordWithToken({email, token}),
                            error: (error) => console.log("recaptchaForgotPasswordEmail error", error),

                        }),
                        catchError(() => EMPTY)
                    )
            ),
        ));


    //    this.sendForgotEmailPasswordWithToken({email, token}

    readonly loadDetailByDetailIdEffect = this.effect(
        (detailId$: Observable<number>) => detailId$.pipe(
            filter((detailId) => !!detailId),
            tap(() => this.patchState({loading: true})),
            switchMap((detailId) => this.service.fetchDetailById(detailId)
                .pipe(
                    tap({
                        next: (response: ApartmentDetail) => this.patchState({selectedDetailPage: response}),
                        error: (error: HttpErrorResponse) => this.patchState({error: error.error}),
                    }),
                    catchError(() => EMPTY),
                    finalize(() => this.patchState({loading: false}))
                )
            ),
        ));

    readonly deleteDetailEffect = this.effect(
        (detail$: Observable<ApartmentDetail>) => detail$.pipe(
            tap((detail) => console.log("(effect) delete Detail, id", detail.id)),
            switchMap(
                (detail) => this.service.deleteApartmentDetail(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                // this.patchState({activeMenuUrl: null});
                                this.loadHeaderByHost();
                                // this.router.navigate(['/']);

                                //this.router.navigate(['/']);
                                //     this.patchState({activeDetailUrl: null});
//TO FIX, load all
                                //  this.router.navigate(['/'], { queryParams: { loadHeader: true } });
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    readonly deleteItemEffect = this.effect(
        (item$: Observable<ApartmentItem>) => item$.pipe(
            tap((item) => console.log("(effect) delete Item, id", item.id)),
            switchMap(
                (item) => this.service.deleteItem(item)
                    .pipe(
                        tap({
                            next: (response) => {
                                this.loadDetailByDetailIdEffect(item.detailId);
                                //notification window, item deleted
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    readonly createItemEffect = this.effect(
        (detail$: Observable<Partial<ApartmentItem>>) => detail$.pipe(
            tap(() => console.log("(effect) create Item")),
            switchMap(
                (detail) => this.service.createItem(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                this.loadDetailByDetailIdEffect(response.detailId);
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    readonly updateItemEffect = this.effect(
        (detail$: Observable<Partial<ApartmentItem>>) => detail$.pipe(
            tap(() => console.log("(effect) update Item")),
            switchMap(
                (detail) => this.service.updateItem(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                this.loadDetailByDetailIdEffect(response.detailId);
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));


    readonly createDetailEffect = this.effect(
        (detail$: Observable<Partial<ApartmentDetail>>) => detail$.pipe(
            tap((detail) => console.log("(effect) create Detail", detail)),
            switchMap(
                (detail) => this.service.createDetail(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                this.patchState({selectedDetailPage: response.detail});
                                const topUrl = response.detail.topMenu.menuUrl ? response.detail.topMenu.menuUrl : response.header.activeTopMenuUrl;
                                const sideUrl = response.detail.sideMenu.panelUrl ? response.detail.sideMenu.panelUrl : response.header.activeSideMenuUrl;
                                const header: Header = {
                                    ...response.header,
                                    activeTopMenuUrl: topUrl,
                                    activeSideMenuUrl: sideUrl,
                                }
                                this.patchState({header: header});
                                this.router.navigate([topUrl, sideUrl]);
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));


    readonly updateDetailEffect = this.effect(
        (detail$: Observable<Partial<ApartmentDetail>>) => detail$.pipe(
            tap(() => console.log("(effect) update Detail")),
            withLatestFrom(
                this.activeMenu$
            ),
            switchMap(
                ([detail, activeMenu]) => this.service.updateDetail(detail)
                    .pipe(
                        tap({
                            next: (response) => {
                                this.patchState({selectedDetailPage: response.detail});
                                const menuTopUrl = response.detail.topMenu.menuUrl ? response.detail.topMenu.menuUrl : response.header.activeTopMenuUrl;
                                const menuSideUrl = response.detail.sideMenu.panelUrl ? response.detail.sideMenu.panelUrl : response.header.activeSideMenuUrl;
                                const header: Header = {
                                    ...response.header,
                                    activeTopMenuUrl: menuTopUrl,
                                    activeSideMenuUrl: menuSideUrl,
                                }
                                this.patchState({header: header});
                                this.router.navigate([menuSideUrl, menuSideUrl]);
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));


    readonly updateMenuEffect = this.effect(
        (detail$: Observable<Partial<Menu>>) => detail$.pipe(
            tap(() => console.log("(effect) update Menu")),
            withLatestFrom(
                this.activeMenu$
            ),
            switchMap(
                ([menu, activeMenu]) => this.service.updateMenu(menu)
                    .pipe(
                        tap({
                            next: (response) => {
                                if (activeMenu.top === response.menuUrl) {
                                    this.loadHeaderByHost();
                                    // this.patchState({header: response});
                                    // this.patchState({activeDetailUrl: response.titleUrl});
                                    //this.router.navigate([response.titleUrl]);
                                    // this.loadDetailByRouteLabelsEffect(response.menuUrl);
                                } else {
                                    this.router.navigate([response.menuUrl], {queryParams: {loadHeader: true}});
                                }
                            },
                            error: (error) => this.patchState({error: error.error}),
                        }),
                        catchError(() => EMPTY),
                        finalize(() => {
                            },
                        )),
            ),
        ));

    readonly updateUserRoleEffect = this.effect((params$: Observable<{ userId: number; role: string }>) => params$.pipe(
        switchMap(({userId, role}) => this.service.updateUsersRole(userId, role).pipe(
            tapResponse(
                () => console.log("Role updated"),
                (error: HttpErrorResponse) =>
                    this.patchState({error: error.error}),
            ),
            catchError(() => EMPTY),
            finalize(() => {
                },
            )),
        ),
    ));

    readonly deleteApartmentByIdEffect = this.effect(
        (id$: Observable<number>) =>
            id$.pipe(
                switchMap((id) => this.service.deleteApartment(id).pipe(
                    tap({
                        next: (response) => this.loadCustomersEffect(),
                        error: (error) => this.patchState({error: error.error}),
                    }),
                    catchError(() => EMPTY),
                    finalize(() => {
                        },
                    )),
                ))
    );

    setHeader(header: Header) {
        this.patchState({header: header});
    }

    selectIso(country: string) {
        console.log("ISO selected", country);
        this.translateService.use(country);
        this.patchState({selectedIso: country});
    }

    setMobileView(isMobile: boolean) {
        this.patchState({isMobile: isMobile});
    }

    loadDomains(chip: Chip | null = null,
                title: string | null = null,
                sortDirection: string = 'asc',
                pageIndex: number = 0,
                pageSize: number = 20) {

        // console.log("chip", chip);
        // console.log("title", title);
        // console.log("sortDirection", sortDirection);
        // console.log("pageIndex", pageIndex);
        // console.log("pageSize", pageSize);

        this.patchState({
            filterChip: chip,
            filterTitle: title,
            paginationPage: pageIndex,
            paginationSize: pageSize,
            paginationSort: sortDirection,
        });
    }

    setActiveMenuAndPanel(topMenu: string, sideMenu: string) {
        this.patchState({activeTopMenuUrl: topMenu, activeSideMenuUrl: sideMenu});
    }

    shrinkMenu(shrinkMenu: boolean) {
        this.patchState({shrinkMenu: shrinkMenu});
    }

    constructor() {
        console.log("CONSTRUCTOR STORE");
        super(initialApartmentState);
    }
}
