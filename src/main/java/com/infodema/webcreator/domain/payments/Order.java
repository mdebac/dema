package com.infodema.webcreator.domain.payments;

import com.infodema.webcreator.domain.core.Customer;
import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Order extends AbstractAuditModel {

    private String orderTrackingNumber;
    private int totalQuantity;
    private BigDecimal totalPrice;
    private String status;
    private Set<OrderItem> orderItems;
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
}









