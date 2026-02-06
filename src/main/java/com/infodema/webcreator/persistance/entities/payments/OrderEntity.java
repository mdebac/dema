package com.infodema.webcreator.persistance.entities.payments;

import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.security.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class OrderEntity  extends BaseAuditEntity {

    private String orderTrackingNumber;
    private int totalQuantity;
    private BigDecimal totalPrice;
    private String status;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

//    @OneToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "shipping_address_id", referencedColumnName = "id")
//    private AddressEntity shippingAddress;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "address",
            joinColumns = @JoinColumn(name = "order_id", nullable = false)
    )
    @Builder.Default
    private Set<AddressEntity> shippingAddresses = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "order_items",
            joinColumns = @JoinColumn(name = "order_id", nullable = false)
    )
    @Builder.Default
    private Set<OrderItemEntity> orderItems = new HashSet<>();

}









