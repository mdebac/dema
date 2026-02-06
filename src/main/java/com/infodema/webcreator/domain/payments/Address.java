package com.infodema.webcreator.domain.payments;

import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class Address {
    private String streetLine1;
    private String streetLine2;
    private String city;
    private String zipCode;
    private String country;
    private Order order;
}



