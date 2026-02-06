package com.infodema.webcreator.domain.payments;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class MerchantAccountPayload {

    private String businessName;
    private Address businessAddress;
}
