package com.infodema.webcreator.services;

import com.infodema.webcreator.config.StripeConfig;
import com.infodema.webcreator.domain.payments.*;
import com.infodema.webcreator.persistance.entities.payments.OrderEntity;
import com.infodema.webcreator.persistance.entities.security.User;
import com.infodema.webcreator.persistance.repositories.security.UserRepository;
import com.stripe.Stripe;
import com.stripe.StripeClient;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.SetupIntent;
import com.stripe.model.checkout.Session;
import com.stripe.model.v2.core.Account;
import com.stripe.model.v2.core.AccountLink;
import com.stripe.param.SetupIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.v2.core.AccountCreateParams;
import com.stripe.param.v2.core.AccountLinkCreateParams;
import com.stripe.param.v2.core.AccountUpdateParams;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
//
//    private static final StripeClient client = new StripeClient(Stripe.apiKey);
//    private final AuditorAware<User> auditorAware;
//    private final UserRepository userRepository;
//
//    public void refund(BigDecimal amount) {
//    }
//
//    @Transactional
//    public PurchaseResponse placeOrder(Purchase purchase) {
//
//        // retrieve the order info from dto
//        // OrderEntity orderEntity = purchase.getOrder();
//
//        // generate tracking number
////        String orderTrackingNumber = generateOrderTrackingNumber();
////        orderEntity.setOrderTrackingNumber(orderTrackingNumber);
//
//        // populate order with orderItems
////        Set<OrderItem> orderItems = purchase.getOrderItems();
////        orderItems.forEach(item -> orderEntity.add(item));
//
//
//        // populate customer with order
////        Customer customer = purchase.getCustomer();
//        OrderEntity orderEntity = new OrderEntity();
//        orderEntity.setOwner(auditorAware.getCurrentAuditor().orElseThrow());
//
//
//        // populate order with billingAddress and shippingAddress
////        orderEntity.setBillingAddress(purchase.getBillingAddress());
////        orderEntity.setShippingAddress(purchase.getShippingAddress());
//
//
//        // check if this is an existing customer
////        String theEmail = customer.getEmail();
////
////        Customer customerFromDB = customerRepository.findByEmail(theEmail);
//
////        if (customerFromDB != null) {
////            // we found them ... let's assign them accordingly
////            customer = customerFromDB;
////        }
////
////        customer.add(order);
////
////        // save to the database
////        customerRepository.save(customer);
////
////        // return a response
////        return new PurchaseResponse(orderTrackingNumber);
//        return null;
//    }
//
//    //https://docs.stripe.com/api/payment_intents/create#create_payment_intent-on_behalf_of
//    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
//
//        List<String> paymentMethodTypes = new ArrayList<>();
//        paymentMethodTypes.add("card");
//
//        Map<String, Object> params = new HashMap<>();
//        params.put("amount", paymentInfo.getAmount());
//        params.put("currency", paymentInfo.getCurrency());
//        params.put("payment_method_types", paymentMethodTypes);
//        params.put("description", "Luv2Shop purchase");
//        params.put("receipt_email", paymentInfo.getReceiptEmail());
//        // params.put("on_behalf_of", Stripe account ID that these funds are intended for);
//
//        /*
//
//         */
//        return PaymentIntent.create(params);
//    }
//
//    private String generateOrderTrackingNumber() {
//        // generate a random UUID number (UUID version-4)
//        // For details see: https://en.wikipedia.org/wiki/Universally_unique_identifier
//        //
//        return UUID.randomUUID().toString();
//    }
//
//    @Transactional
//    public void createConnectedAccountV2(MerchantAccountPayload payload) throws StripeException {
//
//        var user = auditorAware.getCurrentAuditor().orElseThrow(() -> new EntityNotFoundException("No user found In Auditor"));
//
//        if (user.getStripeAccount() == null || user.getStripeAccount().isEmpty()) {
//            //Create new Account
//
//            AccountCreateParams params =
//                    AccountCreateParams.builder()
//                            .setContactEmail(user.getEmail())
//                            .setDisplayName(payload.getBusinessName())
//                            .setIdentity(
//                                    AccountCreateParams.Identity.builder()
//                                            .setCountry(payload.getBusinessAddress().getCountry())
//                                            .setEntityType(AccountCreateParams.Identity.EntityType.COMPANY)
//                                            .setBusinessDetails(
//                                                    AccountCreateParams.Identity.BusinessDetails.builder()
//                                                            .setRegisteredName(payload.getBusinessName())
//                                                            .setAddress(AccountCreateParams.Identity.BusinessDetails.Address.builder()
//                                                                    .setLine1(payload.getBusinessAddress().getStreetLine1())
//                                                                    .setLine2(payload.getBusinessAddress().getStreetLine2())
//                                                                    .setCity(payload.getBusinessAddress().getCity())
//                                                                    .setPostalCode(payload.getBusinessAddress().getZipCode())
//                                                                    .setCountry(payload.getBusinessAddress().getCountry())
//                                                                    .build())
//                                                            .build()
//                                            )
//                                            .build()
//                            )
//                            .setConfiguration(
//                                    AccountCreateParams.Configuration.builder()
//                                            .setCustomer(
//                                                    AccountCreateParams.Configuration.Customer.builder()
//                                                            .setCapabilities(
//                                                                    AccountCreateParams.Configuration.Customer.Capabilities.builder()
//                                                                            .setAutomaticIndirectTax(
//                                                                                    AccountCreateParams.Configuration.Customer.Capabilities.AutomaticIndirectTax.builder()
//                                                                                            .setRequested(true)
//                                                                                            .build()
//                                                                            )
//                                                                            .build()
//                                                            )
//                                                            .build()
//                                            )
//                                            .setMerchant(
//                                                    AccountCreateParams.Configuration.Merchant.builder()
//                                                            .setCapabilities(
//                                                                    AccountCreateParams.Configuration.Merchant.Capabilities.builder()
//                                                                            .setCardPayments(
//                                                                                    AccountCreateParams.Configuration.Merchant.Capabilities.CardPayments.builder()
//                                                                                            .setRequested(true)
//                                                                                            .build()
//                                                                            )
//                                                                            .build()
//                                                            )
//                                                            .build()
//                                            )
//                                            .build()
//                            )
//                            .setDefaults(
//                                    AccountCreateParams.Defaults.builder()
//                                            .setResponsibilities(
//                                                    AccountCreateParams.Defaults.Responsibilities.builder()
//                                                            .setFeesCollector(
//                                                                    AccountCreateParams.Defaults.Responsibilities.FeesCollector.STRIPE
//                                                            )
//                                                            .setLossesCollector(
//                                                                    AccountCreateParams.Defaults.Responsibilities.LossesCollector.STRIPE
//                                                            )
//                                                            .build()
//                                            )
//                                            .build()
//                            )
//                            .setDashboard(AccountCreateParams.Dashboard.FULL)
//                            .addInclude(AccountCreateParams.Include.CONFIGURATION__MERCHANT)
//                            .addInclude(AccountCreateParams.Include.CONFIGURATION__CUSTOMER)
//                            .addInclude(AccountCreateParams.Include.IDENTITY)
//                            .addInclude(AccountCreateParams.Include.DEFAULTS)
//                            .build();
//
//            Account account = client.v2().core().accounts().create(params);
//
//            user.setStripeAccount(account.getId());
//            userRepository.save(user);
//
//        } else {
//
//            client.v2().core().accounts().update(user.getStripeAccount(), AccountUpdateParams.builder()
//                    .setDisplayName(payload.getBusinessName())
//                    .setContactEmail(user.getEmail())
//                    .setIdentity(
//                            AccountUpdateParams.Identity.builder()
//                                    .setCountry(payload.getBusinessAddress().getCountry())
//                                    .setBusinessDetails(
//                                            AccountUpdateParams.Identity.BusinessDetails.builder()
//                                                    .setRegisteredName(payload.getBusinessName())//
//                                                    .setAddress(AccountUpdateParams.Identity.BusinessDetails.Address.builder()
//                                                            .setLine1(payload.getBusinessAddress().getStreetLine1())
//                                                            .setLine2(payload.getBusinessAddress().getStreetLine2())
//                                                            .setCity(payload.getBusinessAddress().getCity())
//                                                            .setPostalCode(payload.getBusinessAddress().getZipCode())
//                                                            .setCountry(payload.getBusinessAddress().getCountry())
//                                                            .build())
//                                                    .build()
//                                    )
//                                    .build()
//                    )
//                    .build());
//        }
//    }
//
//
//    public void myMerchantPayToMeIntent() throws StripeException {
//
//        var user = auditorAware.getCurrentAuditor().orElseThrow(() -> new EntityNotFoundException("No user found In Auditor"));
////        SetupIntentCreateParams params =
////                SetupIntentCreateParams.builder()
////                        .setCustomerAccount("acct_123")
////                        .addPaymentMethodType("stripe_balance")
////                        .setConfirm(true)
////                        .setUsage(SetupIntentCreateParams.Usage.OFF_SESSION)
////                        .setPaymentMethodData(
////                                SetupIntentCreateParams.PaymentMethodData.builder()
////                                        .setType(SetupIntentCreateParams.PaymentMethodData.Type.BASTRIPE_BALANCE)
////                                        .build()
////                        )
////                        .build();
//
//        if(user.getStripeAccount() == null || user.getStripeAccount().isEmpty()) {
//            throw new RuntimeException("No account defined for this Merchant");
//        }else{
//            SetupIntentCreateParams params =
//                    SetupIntentCreateParams.builder()
//                            .putMetadata("order_id", "6735")
//                            .putMetadata("amount", "2")
//                            .putMetadata("description", "description")
//                            .putMetadata("currency", "EUR")
//                            .putMetadata("receipt_email", "receipt@email.com")
//                            .addPaymentMethodType("card")
//                            .setCustomerAccount(user.getStripeAccount())
//                            .build();
//
//            SetupIntent setupIntent = SetupIntent.create(params);
//            System.out.println("client secret: " + setupIntent.getClientSecret());
//        }
//
//
////        Map<String, Object> params = new HashMap<>();
////        params.put("amount", paymentInfo.getAmount());
////        params.put("currency", paymentInfo.getCurrency());
////        params.put("payment_method_types", paymentMethodTypes);
////        params.put("description", "Luv2Shop purchase");
////        params.put("receipt_email", paymentInfo.getReceiptEmail());
//
//
//    }
//
//    private static String createAccountLink() {
//        // response.type("application/json");
//
//        try {
//            //  String connectedAccountId = gson.fromJson(request.body(), RequestBody.class).getAccount();
//            String connectedAccountId = "";
//            AccountLink accountLink = client.v2().core().accountLinks().create(
//                    AccountLinkCreateParams.builder()
//                            .setAccount(connectedAccountId)
//                            .setUseCase(
//                                    AccountLinkCreateParams.UseCase.builder()
//                                            .setType(AccountLinkCreateParams.UseCase.Type.ACCOUNT_ONBOARDING)
//                                            .setAccountOnboarding(
//                                                    AccountLinkCreateParams.UseCase.AccountOnboarding.builder()
//                                                            .addConfiguration(
//                                                                    AccountLinkCreateParams.UseCase.AccountOnboarding.Configuration.RECIPIENT
//                                                            )
//                                                            .setReturnUrl("http://localhost:4242/return/" + connectedAccountId)
//                                                            .setRefreshUrl("http://localhost:4242/refresh/" + connectedAccountId)
//                                                            .build()
//                                            )
//                                            .build()
//                            )
//                            .build()
//            );
//
//            return accountLink.getUrl();
//            //  CreateAccountLinkResponse accountLinkResponse = new CreateAccountLinkResponse(accountLink.getUrl());
//            //  return gson.toJson(accountLinkResponse);
//        } catch (Exception e) {
//            System.out.println("An error occurred when calling the Stripe API to create an account link: " + e.getMessage());
//            // response.status(500);
//            //return gson.toJson(new ErrorResponse(e.getMessage()));
//            throw new RuntimeException("Stripe problem");
//        }
//    }
//
//
//    private static class CreateAccountLinkResponse {
//        private String url;
//
//        public CreateAccountLinkResponse(String url) {
//            this.url = url;
//        }
//    }
//
//    private static class CreateAccountResponse {
//        private String account;
//
//        public CreateAccountResponse(String account) {
//            this.account = account;
//        }
//    }
//
//    private static String createAccount(String email) {
//
//        try {
//
//            Account account = client.v2().core().accounts().create(
//                    AccountCreateParams.builder()
//                            .setDashboard(AccountCreateParams.Dashboard.EXPRESS)
//                            .setContactEmail(email)
//                            .setDefaults(
//                                    AccountCreateParams.Defaults.builder()
//                                            .setResponsibilities(
//                                                    AccountCreateParams.Defaults.Responsibilities.builder()
//                                                            .setFeesCollector(
//                                                                    AccountCreateParams.Defaults.Responsibilities.FeesCollector.APPLICATION
//                                                            )
//                                                            .setLossesCollector(
//                                                                    AccountCreateParams.Defaults.Responsibilities.LossesCollector.APPLICATION
//                                                            )
//                                                            .build()
//                                            )
//                                            .build()
//                            )
//                            .setConfiguration(
//                                    AccountCreateParams.Configuration.builder()
//
//                                            .setRecipient(
//                                                    AccountCreateParams.Configuration.Recipient.builder()
//                                                            .setCapabilities(
//                                                                    AccountCreateParams.Configuration.Recipient.Capabilities.builder()
//                                                                            .setStripeBalance(
//                                                                                    AccountCreateParams.Configuration.Recipient.Capabilities.StripeBalance.builder()
//                                                                                            .setStripeTransfers(
//                                                                                                    AccountCreateParams.Configuration.Recipient.Capabilities.StripeBalance.StripeTransfers.builder()
//                                                                                                            .setRequested(true)
//                                                                                                            .build()
//                                                                                            )
//                                                                                            .build()
//                                                                            )
//                                                                            .build()
//                                                            )
//                                                            .build()
//                                            )
//
//                                            .build()
//                            )
//                            .setIdentity(
//                                    AccountCreateParams.Identity.builder()
//                                            .setCountry("HR")
//                                            .build()
//                            )
//                            .addInclude(AccountCreateParams.Include.CONFIGURATION__MERCHANT)
//                            .addInclude(AccountCreateParams.Include.CONFIGURATION__RECIPIENT)
//                            .addInclude(AccountCreateParams.Include.IDENTITY)
//                            .addInclude(AccountCreateParams.Include.DEFAULTS)
//                            .build()
//            );
//
//            //  CreateAccountResponse accountResponse = new CreateAccountResponse(account.getId());
//            return account.getId();
//            //  return gson.toJson(accountResponse);
//        } catch (Exception e) {
//            System.out.println("An error occurred when calling the Stripe API to create an account: " + e.getMessage());
//            throw new RuntimeException("Stripe problem");
//            //  return gson.toJson(new ErrorResponse(e.getMessage()));
//        }
//    }
//
//    public StripeDemaResponse checkoutProducts(ProductRequest productRequest) {
//        // Set your secret key. Remember to switch to your live secret key in production!
//        // Stripe.apiKey = secretKey;
//
//        // Create a PaymentIntent with the order amount and currency
//        SessionCreateParams.LineItem.PriceData.ProductData productData =
//                SessionCreateParams.LineItem.PriceData.ProductData.builder()
//                        .setName(productRequest.getName())
//                        .build();
//
//        // Create new line item with the above product data and associated price
//        SessionCreateParams.LineItem.PriceData priceData =
//                SessionCreateParams.LineItem.PriceData.builder()
//                        .setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency() : "USD")
//                        .setUnitAmount(productRequest.getAmount())
//                        .setProductData(productData)
//                        .build();
//
//        // Create new line item with the above price data
//        SessionCreateParams.LineItem lineItem =
//                SessionCreateParams
//                        .LineItem.builder()
//                        .setQuantity(productRequest.getQuantity())
//                        .setPriceData(priceData)
//                        .build();
//
//        // Create new session with the line items
//        SessionCreateParams params =
//                SessionCreateParams.builder()
//                        .setMode(SessionCreateParams.Mode.PAYMENT)
//                        .setSuccessUrl("http://localhost:8080/success")
//                        .setCancelUrl("http://localhost:8080/cancel")
//                        .addLineItem(lineItem)
//                        .build();
//
//        // Create new session
//        Session session = null;
//        try {
//            session = Session.create(params);
//        } catch (StripeException e) {
//            //log the error
//        }
//
//        return StripeDemaResponse.builder()
//                .status("SUCCESS")
//                .message("Payment session created ")
//                .sessionId(session.getId())
//                .sessionUrl(session.getUrl())
//                .build();
//    }


}
