package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.Panel;
import com.infodema.webcreator.domain.core.PanelIso;
import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelIsoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class PanelMapper extends AbstractMapper {

    public List<Panel> toDomain(List<PanelEntity> entities) {
        return convertCollection(entities, this::toDomain);
    }

    public Set<PanelIso> toDomainIso(Set<PanelIsoEntity> entities) {
        return convertCollection(entities, this::toDomainIso);
    }

    public Set<PanelIsoEntity> toEntityIso(Set<PanelIso> entities) {
        return convertCollection(entities, this::toEntityIso);
    }

    public Panel toDomain(PanelEntity entity) {
        return Panel.builder()
                .id(entity.getId())
                .menuId(entity.getMenu().getId())
                .panelUrl(entity.getPanelUrl())
                .type(entity.getSideMenuType())
                .icon(entity.getIcon())
                .orderNum(entity.getOrderNum())
                .image(entity.getImageContent())
                .iso(toDomainIso(entity.getIso()))
                .createdOn(entity.getCreatedOn())
                .createdBy(entity.getCreatedBy())
                .modifiedOn(entity.getModifiedOn())
                .modifiedBy(entity.getModifiedBy())
                .build();
    }

    public List<PanelEntity> toEntity(List<Panel> models) {
        return convertCollection(models, this::toEntity);
    }

    public PanelEntity toEntity(Panel panel) {
        return PanelEntity.builder()
                .id(panel.getId())
                .iso(toEntityIso(panel.getIso()))
                .orderNum(panel.getOrderNum())
                .panelUrl(panel.getPanelUrl())
                .sideMenuType(panel.getType())
                .icon(panel.getIcon())
                .build();
    }

    public PanelIso toDomainIso(PanelIsoEntity entity) {
        return PanelIso.builder()
                .iso(entity.getIso().getCountryCode())
                .description(entity.getDescription())
                .title(entity.getTitle())
                .build();
    }

    public PanelIsoEntity toEntityIso(PanelIso domain) {
        return PanelIsoEntity.builder()
                .iso(Country.fromCode(domain.getIso()))
                .description(domain.getDescription())
                .title(domain.getTitle())
                .build();
    }


    public void updateEntityByModel(PanelEntity entity, Panel panel) {
        if(panel.getIso() != null) {
            entity.setIso(toEntityIso(panel.getIso()));
        }
        entity.setPanelUrl(panel.getPanelUrl());
        entity.setSideMenuType(panel.getType());
        entity.setOrderNum(panel.getOrderNum());
        entity.setIcon(panel.getIcon());
    }
}

