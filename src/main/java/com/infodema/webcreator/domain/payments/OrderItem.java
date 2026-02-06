package com.infodema.webcreator.domain.payments;

import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@RequiredArgsConstructor
@AllArgsConstructor
@Data
public class OrderItem {
    private int quantity;
    private Long productId;
    private Order order;
}








