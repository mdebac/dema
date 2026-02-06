package com.infodema.webcreator.persistance.entities.payments;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@SuperBuilder
@RequiredArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
@Data
public class OrderItemEntity {

    @EqualsAndHashCode.Exclude
    private int quantity;

    @Column(nullable = false)
    private Long productId;

}








