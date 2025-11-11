package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Detail extends AbstractAuditModel {

    private Integer columns;

    private boolean show;
    private List<Item> items;
    private Set<DetailIso> iso;
    private Integer cornerRadius;
//    cornerRadiusPanel: number;
    private String backgroundColor;

    private Menu topMenu;
    private Panel sideMenu;
}
