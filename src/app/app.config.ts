import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {HttpClient, provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {provideNativeDateAdapter} from "@angular/material/core";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {authInterceptor} from "./interceptors/auth.interceptor";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
//import {httpErrorInterceptor} from "./interceptors/auth.interceptor";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
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
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideNativeDateAdapter(),
    //provideTranslateService(),
  ]
};
