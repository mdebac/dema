import {Component, HostBinding, HostListener, inject, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {filter, map} from "rxjs/operators";
import {defaultIso} from "../../domain/countries-iso";
import {ApartmentIso} from "../../domain/apartment-iso";
import {ActivatedRoute, Data, Router, RouterLink, RouterOutlet} from "@angular/router";
import {LetDirective} from '@ngrx/component';
import {ApartmentStore} from "../../services/apartments-store.service";
import {IsoButtonsComponent} from "../iso-buttons/iso-buttons.component";
import {Roles} from "../../domain/roles";
import {Hosts} from "../../domain/hosts";
import {AuthStore} from "../../services/authentication/auth-store";
import {UserButtonsComponent} from "../user-buttons/user-buttons.component";
import {MatDialog} from "@angular/material/dialog";
import {Title} from "@angular/platform-browser";
import {Link} from "../../domain/link";
import {TranslateService} from "@ngx-translate/core";
import {MainConfComponent} from "./main-conf/main-conf.component";
import {MobileTopMenuComponent} from "../mobile-menu/mobile-top-menu.component";
import {TopMenuComponent} from "../top-menu/top-menu.component";
import {QuillViewComponent} from "ngx-quill";
import {NgClass} from "@angular/common";
import {MenuIso} from "../../domain/menu-iso";
import {MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MenuProperty} from "../../domain/menu-property";
import {ProductType} from "../../domain/product-type";
import {SafeHtmlPipe} from "../../pipes/safe-html-pipe";

@Component({
    selector: 'start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [UserButtonsComponent, LetDirective, IsoButtonsComponent, RouterOutlet, MainConfComponent, MobileTopMenuComponent, TopMenuComponent, QuillViewComponent, NgClass, MatFabButton, MatIcon, RouterLink, SafeHtmlPipe],
})
export class StartComponent implements OnInit, OnDestroy {

    readonly store = inject(ApartmentStore);
    readonly activatedRoute = inject(ActivatedRoute);
    readonly authStore = inject(AuthStore);
    readonly dialog = inject(MatDialog);
    readonly router = inject(Router);
    readonly titleService = inject(Title);
    readonly translateService = inject(TranslateService);

    unsubscribe$ = new Subject<void>();
    selectedIso$ = this.store.selectedIso$;
    role$ = this.authStore.roles$;
    loggedIn: boolean = true;
    isLoggedIn$: Observable<boolean> | undefined;
    user$ = this.authStore.user$;
    isHostAdriaticSun: boolean = false;
    isHostResidence: boolean = false;
    headerData$ = this.store.headerData$;
    products$ = this.store.products$;
    menuSide$ = this.store.side$;
    isMobile$ = this.store.isMobile$;
    isTopMenuActive$ = this.store.isTopMenuActive$;
    browserLang: string | undefined = '';
    activeDetail$ = this.store.selectedDetailPage$.pipe(filter((e) => !!e));
    menuProductCriteria$ = this.store.menuProductCriteria$;

    //TODO
    protected breadcrumbs: Link[] = [
        {
            label: 'About Us',
            path: '/about'
        }
    ]

    formatPdfData( prop: MenuProperty, products: ProductType[], productId: number | undefined){
        const product = products.find(p=>p.id === productId);
        const property = product?.properties.find(prodProp=>prop.name == prodProp.name);
        return prop.name + ": " + prop.value + " " + property?.unit;
    }

    @HostBinding("style.--title-size")
    titleSize: string = "4.2rem";

    @HostListener('window:resize')
    onResize() {
        // console.log("resize", window.innerWidth);
        if (window.innerWidth < 600) {
            this.titleSize = "1.2rem";
            this.store.setMobileView(true);
        } else {
            this.store.setMobileView(false);
            this.titleSize = "4.2rem";
        }
    }

    ngOnInit() {
        console.log("StartComponent ngOnInit");
        //  console.log("ngOnInit size", window.innerWidth);
        if (window.innerWidth < 600) {
            this.titleSize = "1.2rem";
            this.store.setMobileView(true);
        } else {
            this.store.setMobileView(false);
            this.titleSize = "4.2rem";
        }
        this.user$ = this.authStore.user$;
        this.isLoggedIn$ = this.authStore.isLoggedIn$;
        this.store.loadMenuProductsByCriteriaEffect(this.menuProductCriteria$);
        this.browserLang = this.translateService.getBrowserLang();
        this.activatedRoute.data.pipe(map((data: Data) => data['myData'])).subscribe(
            data => {

                const title = data.main.iso.find((iso: { iso: string; }) => iso.iso === defaultIso)?.title;
                const plainTitle = title?.replace(/<[^>]*>/g, '');
                const finalTitle = plainTitle?.replace("&nbsp;", " ");

                if (this.browserLang) {
                    if (this.browserLang.includes('en')) {
                        this.store.selectIso(defaultIso);
                    } else {
                        const isHave = data?.main.languages.filter((l: {
                            iso: string | undefined;
                        }) => l.iso === this.browserLang?.toUpperCase());
                        if (isHave.length === 1) {
                            this.store.selectIso(this.browserLang.toUpperCase());
                        } else {
                            this.store.selectIso(defaultIso);
                        }
                    }
                }

                this.titleService.setTitle(finalTitle ? finalTitle : "");
                this.store.setHeader(data);
                this.store.loadDetailByRouteLabelsEffect(this.store.activeMenu$);
                this.isHostAdriaticSun = data?.host === Hosts.ADRIATICSUN_EU;
                this.isHostResidence = data?.host === Hosts.RESIDENCE_INFO_DEMA_EU;
                console.log("koji je host", data?.host);
            }
        )
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
        // this.breadcrumbs.removeItem('')
    }

    toHome() {
        this.router.navigate(['/']);
    }

    activeIso(active: string) {
        this.store.selectIso(active);
    }

    getIconText(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.iconText;
        } else return "";
    }

    getTitle(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            return iso.find(iso => iso.iso === country)?.title;
        } else return "";
    }

    getTitleFromMenu(country: string | null, iso: MenuIso[] | undefined) {
        if (country && iso) {
            const text = iso?.find(iso => iso.iso === country)?.title;
            //  console.log("text title", text);
            if (text) {
                if (text.includes("2.3em")) {
                    //       console.log("tjeeeeeeeeeeele", text.replace("2.3em","6.25em"));
                }
                return text.includes("2.3em") ? text.replace("2.3em", "6.25em") : text;
            }
        }
        return "";
    }

    getTitleMobile(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {

            const text = iso?.find(iso => iso.iso === country)?.title;
            if (text) {
                if (text.includes("6.25em")) {
                    return text.replace("6.25em", "1.8em");
                }
                if (text.includes("4em")) {
                    return text.replace("4em", "1.8em");
                }
                if (text.includes("2.5em")) {
                    return text.replace("2.5em", "1.8em");
                }
                if (text.includes("2.3em")) {
                    return text.replace("2.3em", "1.8em");
                }
                return text;

            }
            return "";
        } else return "";
    }

    getTitleFromMenuMobile(country: string | null, iso: MenuIso[] | undefined) {
        if (country && iso) {
            const text = iso?.find(iso => iso.iso === country)?.title;
            console.log("getTitleFromMenuMobile", text);
            if (text) {
                if (text.includes("6.25em")) {
                    return text.replace("6.25em", "1.8em");
                }
                if (text.includes("4em")) {
                    return text.replace("4em", "1.8em");
                }
                if (text.includes("2.5em")) {
                    return text.replace("2.5em", "1.8em");
                }
                if (text.includes("2.3em")) {
                    return text.replace("2.3em", "1.8em");
                }
                return text;
            }
        }
        return "";
    }

    getDescription(country: string | null, iso: ApartmentIso[] | undefined) {
        if (country && iso) {
            // if (text) {
            //     if (text.includes("1.8em")) {
            //         return text.replace("1.8em", "1.25em");
            //     }
            // }

            return iso.find(iso => iso.iso === country)?.description;
        } else return "";
    }

    getDescriptionFromMenu(country: string | null, iso: MenuIso[] | undefined) {
        if (country && iso) {
            const text = iso?.find(iso => iso.iso === country)?.description;
            // console.log("text desc", text);
            if (text) {
                return text.includes("2.3em") ? text.replace("2.3em", "2.3em") : text;
            }
        }
        return "";
    }


    getTitleAndDescription(country: string | null, iso: ApartmentIso[] | undefined) {

        const title = this.getTitle(country, iso);
        const description = this.getDescription(country, iso);

        let output: string = "";
        if (title) {
            output = output + title;
        }
        if (description) {
            output = output + description;
        }
        return output;
    }

    getTitleAndDescriptionFromMenu(country: string | null, iso: MenuIso[] | undefined) {

        const title = this.getTitleFromMenu(country, iso);
        const description = this.getDescriptionFromMenu(country, iso);

        let output: string = "";
        if (title) {
            output = output + title;
        }
        if (description) {
            output = output + description;
        }
        return output;
    }


    protected readonly Roles = Roles;
}

