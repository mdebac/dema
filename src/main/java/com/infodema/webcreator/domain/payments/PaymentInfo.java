package com.infodema.webcreator.domain.payments;

import lombok.Data;

@Data
public class PaymentInfo {

    private Long amount;
    private String currency;
    private String receiptEmail;

}
