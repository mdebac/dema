package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.Getter;
import lombok.ToString;
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
