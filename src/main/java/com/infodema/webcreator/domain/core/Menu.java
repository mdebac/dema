package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.enums.Chip;
import com.infodema.webcreator.domain.enums.Side;
import com.infodema.webcreator.domain.enums.Layout;
import com.infodema.webcreator.domain.enums.TopMenuType;
import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Menu extends AbstractAuditModel {
    private Long mainId;
    private String icon;
    private String menuUrl;
    private Side side;
    private Layout layout;
    private TopMenuType type;
    private Boolean hideMenuPanelIfOne;
    private Boolean panelOn;
    private Boolean searchOn;
    private Integer orderNum;
    private Long  beforeId;
    private Long nextId;
    private Chip chip;
    private byte[] image;
    private Boolean removeImage;
    private Set<MenuIso> iso;
    private Set<MenuProperty> properties;
    private List<Panel> panels;
    private Long productId;
}
