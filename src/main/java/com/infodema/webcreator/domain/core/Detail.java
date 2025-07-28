package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import com.infodema.webcreator.persistance.entities.detail.DetailIso;
import lombok.*;
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

    private Long mainId;
    private Integer columns;
    private String icon;
    private String titleUrl;
    private String host;
    private boolean show;
    private List<Item> items;
    private Set<DetailIso> iso;
}
