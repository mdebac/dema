package com.infodema.webcreator.domain.core;

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
public class Customer extends AbstractAuditModel {
    private String role;
    private String name;
    private String email;
    private String host;
}
