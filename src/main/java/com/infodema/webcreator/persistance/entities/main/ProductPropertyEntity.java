package com.infodema.webcreator.persistance.entities.main;

import com.infodema.webcreator.domain.enums.ProductPropertyType;
import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product_properties")
public class ProductPropertyEntity extends BaseAuditEntity {

    @Column(nullable = false)
    private String name;
    private String unit;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductPropertyType type;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private ProductEntity product;
}
