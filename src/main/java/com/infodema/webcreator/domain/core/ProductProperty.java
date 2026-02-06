package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.enums.ProductPropertyType;
import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ProductProperty extends AbstractAuditModel {
    private String name;
    private Long productId;
    private String unit;
    private ProductPropertyType type;
}
