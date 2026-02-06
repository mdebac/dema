import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {
    provideRouter,
} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideNativeDateAdapter} from "@angular/material/core";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {authInterceptor} from "./interceptors/auth.interceptor";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {RECAPTCHA_V3_SITE_KEY, RecaptchaModule, RecaptchaV3Module} from "ng-recaptcha-2";
import {environment} from "../environments/environment";
import {provideQuillConfig} from 'ngx-quill';
import {allFonts} from "./domain/font";
import {NgxStripeModule} from "ngx-stripe";

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideQuillConfig({
            customOptions: [
                {
                    import: 'formats/font',
                    whitelist: allFonts()
                },
                {
                    import: 'attributors/style/size',
                    whitelist: ['1.25em', '1.8em','2.3em', '2.5em', '4em', '6.25em']
                }
            ]
        }),
        provideZoneChangeDetection({eventCoalescing: true}),
        provideRouter(routes),
        provideAnimations(),
        provideAnimationsAsync(),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            }),
            RecaptchaModule,
            RecaptchaV3Module,
            NgxStripeModule.forRoot(environment.stripePublishableKey),
        ),
        {provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey},
        provideHttpClient(withInterceptors([authInterceptor])),
        provideNativeDateAdapter(),
    ]
};
