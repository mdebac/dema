package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.util.Set;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ProductType extends AbstractAuditModel {
    private Long mainId;
    private String name;
    private Set<ProductProperty> properties;
}
