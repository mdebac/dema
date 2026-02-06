package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.enums.Chip;
import com.infodema.webcreator.domain.enums.SideMenuType;
import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import java.util.Set;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Panel extends AbstractAuditModel {
    private Long menuId;
    private String panelUrl;
    private String icon;
    private SideMenuType type;
    private Integer orderNum;
    private Long  beforeId;
    private Long nextId;
    private Chip chip;

    private Set<PanelIso> iso;
    private byte[] image;
    private Boolean removeImage;
}
