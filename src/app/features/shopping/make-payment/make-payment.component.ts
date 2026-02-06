import {ViewChild, Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {
    StripeCardComponent, StripeCardCvcComponent,
    StripeCardExpiryComponent,
    StripeCardGroupDirective,
    StripeCardNumberComponent, StripeService
} from 'ngx-stripe';
import {
    StripeCardElementOptions,
    StripeElementsOptions,
} from '@stripe/stripe-js';
import {notOnlyWhitespace} from "../../../validators/not-only-white-space.validator";
import {ApartmentStore} from "../../../services/apartments-store.service";
import {PaymentInfo} from "../../../domain/shopping/payment-info";
import {MatFabButton} from "@angular/material/button";
import {Purchase} from "../../../domain/shopping/purchase";
import {Customer} from "../../../domain/customer";
import {Order} from "../../../domain/shopping/order";
import {OrderItem} from "../../../domain/shopping/order-item";
import {Subject} from "rxjs";
import {filter, takeUntil} from "rxjs/operators";

@Component({
    selector: 'make-payment',
    imports: [
        ReactiveFormsModule,
        MatFabButton,
        StripeCardGroupDirective,
        StripeCardNumberComponent,
        StripeCardExpiryComponent,
        StripeCardCvcComponent,
        StripeCardComponent,
    ],
    templateUrl: './make-payment.component.html',
    styleUrl: './make-payment.component.scss',
})
export class MakePaymentComponent implements OnInit, OnDestroy{
    @ViewChild(StripeCardComponent) card: StripeCardComponent | undefined;
    store = inject(ApartmentStore);
    stripeService = inject(StripeService);
    @Input() user: Customer | undefined;

    unsubscribe$ = new Subject<void>();
    error$ = this.store.error$.pipe(filter((e) => !!e));
    errorMessage: string = ""

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.unsubscribe();
    }

    ngOnInit() {
        // console.log("Dashboard ngOnInit");
        // if(this.isAdmin || this.isManager){
        //     this.store.loadCustomersEffect();
        // }
        this.error$.pipe(takeUntil(this.unsubscribe$)).subscribe((error) => {
          //  this.notificationService.error("error");
            console.log("error na ekranu", error);
            this.errorMessage = error?.message;
            //  this.errorService.constructGrowlFromApiError(error);
        });
    }

    cardOptions: StripeCardElementOptions = {
        style: {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: '300',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                    color: '#CFD7E0',
                },
            },
        },
    };

    elementsOptions: StripeElementsOptions = {
        locale: 'en-GB',
    };

    stripeTest: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) {
        this.stripeTest = this.fb.group({
            name: ['Picasso', [Validators.required]],
            amount: [100000, [Validators.required, Validators.min(0)]],
            shippingAddress: this.fb.group({
                street: ['abs', [Validators.required, Validators.minLength(2), notOnlyWhitespace]],
                city: ['abs', [Validators.required, Validators.minLength(2), notOnlyWhitespace]],
                state: ['abs', [Validators.required]],
                country: ['HR', [Validators.required]],
                zipCode: ['abs', [Validators.required, Validators.minLength(2), notOnlyWhitespace]]
            }),
            billingAddress: this.fb.group({
                street: ['abs', [Validators.required, Validators.minLength(2), notOnlyWhitespace]],
                city: ['abs', [Validators.required, Validators.minLength(2), notOnlyWhitespace]],
                state: ['abs', [Validators.required]],
                country: ['HR', [Validators.required]],
                zipCode: ['abs', [Validators.required, Validators.minLength(2), notOnlyWhitespace]]
            }),
        });
    }

    createMerchantAccount(): void {
        this.store.createAccountEffect();
    }
    pay(): void {
        this.errorMessage = "";
        if (this.stripeTest.valid) {

            console.log("user email", this.user);
            const paymentInfo: PaymentInfo = {
                amount: Math.round(this.stripeTest.value.amount * 100),
                currency: "USD",
                receiptEmail: this.user?.email ? this.user?.email : ""
            }

            console.log("stripe form", this.stripeTest.getRawValue());


            // CartItem orderItem1 = new CartItem(this.item,this.selectedIso);
            //
            // id: number = 0;
            // name: string = "";
            // imageUrl: string;
            // unitPrice: number = 0;
            // quantity: number;
            //

            const orderItem1: OrderItem = {
                productId: 1,
                quantity: 2
            }
            const orderItem2: OrderItem = {
                productId: 3,
                quantity: 1
            }

            const orderItems: OrderItem[] = [orderItem1, orderItem2];
            const order: Order = {
                totalPrice: 2,
                totalQuantity: 4
            };

            const purchase: Purchase = {
                shippingAddress: this.stripeTest.value.shippingAddress,
                billingAddress: this.stripeTest.value.billingAddress,
                order: order,
                orderItems: orderItems
            };


            this.store.paymentEffect({
                paymentInfo: paymentInfo,
                purchase: purchase,
                card: this.card,
                user: this.user
            });

            //
            //   this.stripeService.createPaymentIntent(this.stripeTest.getRawValue())
            //       .pipe(
            //           switchMap((pi) =>
            //               this.stripeService.confirmCardPayment(pi.client_secret, {
            //                 payment_method: {
            //                   card: this.card.element,
            //                   billing_details: {
            //                     name: this.stripeTest.get('name').value,
            //                   },
            //                 },
            //               })
            //           )
            //       )
            //       .subscribe((result) => {
            //         if (result.error) {
            //           // Show error to your customer (e.g., insufficient funds)
            //           console.log(result.error.message);
            //         } else {
            //           // The payment has been processed!
            //           if (result.paymentIntent.status === 'succeeded') {
            //             // Show a success message to your customer
            //           }
            //         }
            //       });
            // } else {
            //   console.log(this.stripeTest);
            // }

        //
        // createPaymentIntent(amount: number): Observable<PaymentIntent> {
        //   return this.http.post<PaymentIntent>(
        //       `${env.apiUrl}/create-payment-intent`,
        //       { amount }
        //   );
        // }
        /*
          this.checkoutService.placeOrder(purchase).subscribe({
                                          next: response => {
                                              alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                                              // reset cart
                                              this.resetCart();
                                              this.isDisabled = false;
                                          },
                                          error: err => {
                                              alert(`There was an error: ${err.message}`);
                                              this.isDisabled = false;
                                          }
                                      })
         */ }
    }


    /*
    TODO Receiving webhook events helps you respond to asynchronous events, such as when a
     1. customer’s bank confirms a payment
     2. customer disputes a charge
     3. recurring payment succeeds.

     4. checkoutSessionComplete
     5. checkoutSessionExpired

     6.subscription Cancelation/renewals event
     */

    //plaćanje tek kad se onborda
    // const paymentIntentData: Stripe.Checkout.SessionCreateParams.PaymentIntentData =
    //      {
    //         // VERIFIED ACCOUNT: Direct transfer to seller immediately
    //         application_fee_amount: platformFeeAmount,
    //         transfer_data: {
    //             destination: sellerStripeAccountId,
    //         },
    //         metadata: {
    //             platformFeeAmount: (platformFeeAmount / 100).toString(),
    //             sellerId: seller._id.toString(),
    //             sellerUserId: sellerUserId,
    //             productId: productInfo.id,
    //             onboarding_type: "deferred",
    //             seller_onboarded: "true",
    //             payment_type: "direct_transfer",
    //         },
    //     };
}
