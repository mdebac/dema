package com.infodema.webcreator.controllers;

import com.infodema.webcreator.domain.payments.*;
import com.infodema.webcreator.domain.utility.UtilityHelper;
import com.infodema.webcreator.services.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

//    @PostMapping("/purchase")
//    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
//
//        return paymentService.placeOrder(purchase);
//    }
//
//    @PostMapping("/payment-intent")
//    public ResponseEntity<String> createPaymentIntent(
//            @RequestHeader("Host") String host,
//            @RequestBody PaymentInfo paymentInfo) throws StripeException {
//
//        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfo);
//
//        host = UtilityHelper.resolveHostForDevelopment(host);
//
//
//        String paymentStr = paymentIntent.toJson();
//
//        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
//    }
//
//    @GetMapping("/create-account")
//    public ResponseEntity<String> createAccount(
//            @RequestHeader("Host") String host) throws StripeException {
//
//        MerchantAccountPayload merchantAccountPayload = new MerchantAccountPayload();
//        merchantAccountPayload.setBusinessName("Ribari 2 d.o.o.");
//        merchantAccountPayload.setBusinessAddress(Address.builder()
//                        .streetLine1("Merchant Street 1")
//                        .country("HR")
//                        .city("Dubrovnik")
//                        .zipCode("12345")
//                .build());
//      // paymentService.createConnectedAccountV2(merchantAccountPayload);
//        return new ResponseEntity<>("ok je", HttpStatus.OK);
//    }
//
//
//    @GetMapping("/create-merchant-invoice")
//    public ResponseEntity<String> createMerchantInvoice(
//            @RequestHeader("Host") String host) throws StripeException {
//
//        // paymentService.createConnectedAccountV2(merchantAccountPayload);
//        return new ResponseEntity<>("ok je", HttpStatus.OK);
//    }
//
//    @GetMapping("/create-merchant-subscription")
//    public ResponseEntity<String> createMerchantSubscription(
//            @RequestHeader("Host") String host) throws StripeException {
//
//        // paymentService.createConnectedAccountV2(merchantAccountPayload);
//        return new ResponseEntity<>("ok je", HttpStatus.OK);
//    }
//
//    @GetMapping("/my-merchant-pay-to-me-intent")
//    public ResponseEntity<String> myMerchantPayToMeIntent(
//            @RequestHeader("Host") String host) throws StripeException {
//
//         paymentService.myMerchantPayToMeIntent();
//        return new ResponseEntity<>("ok je", HttpStatus.OK);
//    }




}
//https://medium.com/@munafbadarpura11/integrating-stripe-payments-in-spring-boot-step-by-step-beginners-guide-2025-1c0388d72a95
