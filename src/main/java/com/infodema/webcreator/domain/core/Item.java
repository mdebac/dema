package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import com.infodema.webcreator.persistance.entities.item.ItemIso;
import com.infodema.webcreator.domain.enums.Chip;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Set;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Item extends AbstractAuditModel {
    private String description;
    private String title;
    private Integer rowSpan;
    private Integer colSpan;
    private Integer cornerRadius;
    private Integer minHeight;
    private String backgroundColor;
    private String url;
    private Chip chip;
    private byte[] image;
    private Integer elevation;
    private Long detailId;
    private Set<ItemIso> iso;
}
