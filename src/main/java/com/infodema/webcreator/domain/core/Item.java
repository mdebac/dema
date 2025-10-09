package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import com.infodema.webcreator.domain.enums.Chip;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import lombok.ToString;
import lombok.Setter;

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
    private Integer orderNum;
    private Integer cornerRadius;
    private Integer minHeight;
    private String backgroundColor;
    private String url;
    private Chip chip;
    private byte[] image;
    private String shadowColor;
    private Long detailId;
    private Set<ItemIso> iso;
}
