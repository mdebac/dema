import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, concatMap, Observable, tap} from 'rxjs';
import {BaseService} from "./base-service";
import {ApiConfiguration} from "./api-configuration";
import {Purchase} from "../domain/shopping/purchase";
import {PaymentInfo} from "../domain/shopping/payment-info";
import {StripeService} from "ngx-stripe";
import {ErrorService} from "./error.service";
import {Customer} from "../domain/customer";


@Injectable({providedIn: 'root'})
export class CheckoutHttpService extends BaseService {

    url: string;
    stripeService = inject(StripeService);
    errorService = inject(ErrorService);

    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http);
        this.url = this.rootUrl;
    }

    placeOrder(purchase: Purchase): Observable<any> {
        const purchaseUrl = this.url + '/purchase';
        return this.http.post<Purchase>(purchaseUrl, purchase);
    }

    createAccount(): Observable<any> {
        const paymentIntentUrl = this.url + '/create-account';

        return this.http.get<string>(paymentIntentUrl).pipe(
            tap((response) => console.log('(http response) createAccount', response)),

            catchError((err) => this.errorService.handleError(err)),
        );
    }


    createPaymentIntent(paymentInfo: PaymentInfo, purchase: Purchase, card: any, customer: Customer | undefined): Observable<any> {
        const paymentIntentUrl = this.url + '/payment-intent';

        return this.http.post<string>(paymentIntentUrl, paymentInfo).pipe(
            tap((response) => console.log('(http response) createPaymentIntent', response)),
            concatMap(paymentIntentResult => {
                // @ts-ignore
                return this.stripeService.confirmCardPayment(paymentIntentResult.client_secret, {
                    payment_method: {
                        card: card.element,
                        billing_details: {
                            email: customer?.email,
                            name: customer?.name,
                            address: {
                                line1: purchase.billingAddress?.streetLine1,
                                line2: purchase.billingAddress?.streetLine2,
                                city: purchase.billingAddress?.city,
                                postal_code: purchase.billingAddress?.zipCode,
                                country: purchase.billingAddress?.country,
                            }
                        }
                    },
                })
            }),
            concatMap(result => {
                if (result.error) {
                   throw new Error(result.error.message);
                } else {
                    if(result.paymentIntent.status === "succeeded"){
                        return this.placeOrder(purchase);
                    }
                    throw new Error("Problem with payment");
                }
            }),

            // if (result.error) {
            //   // inform the customer there was an error
            //   alert(`There was an error: ${result.error.message}`);
            //   this.isDisabled = false;
            // } else {
            //   // call REST API via the CheckoutService
            //   this.checkoutService.placeOrder(purchase).subscribe({
            //     next: response => {
            //       alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
            //
            //       // reset cart
            //       this.resetCart();
            //       this.isDisabled = false;
            //     },
            //     error: err => {
            //       alert(`There was an error: ${err.message}`);
            //       this.isDisabled = false;
            //     }
            //   })
            // }

            catchError((err) => this.errorService.handleError(err)),
        );
    }


    /*
        pay(detail: Partial<ApartmentDetail>): Observable<DetailWithHeader> {
          const url = this.url + "/details/hotel";
          const fetchHeader = this.fetchHeader();
          console.log('(http request) create Detail', detail, url);

          const formData = new FormData();
          if (detail.topMenu?.image) {
              formData.append('top', detail.topMenu.image);
              detail.topMenu.image = null;
          }

          formData.append('payload', new Blob([JSON.stringify(detail)], {
              type: 'application/json'
          }));

          return this.http.post<ApartmentDetail>(url, formData).pipe(
              tap((response) => console.log('(http response) Detail created', response)),
              concatMap(detail => {
                  return fetchHeader.pipe(
                      map(h => {
                          return {detail: detail, header: h}
                      })
                  );
              }),
              catchError((err) => this.errorService.handleError(err)),
          );
      }
     */
}
