package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.*;
import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuIsoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class MenuMapper extends AbstractMapper {

    private final PanelMapper panelMapper;

    public List<Menu> toDomain(List<MenuEntity> entities) {
        return convertCollection(entities, this::toDomain);
    }

    public Set<MenuIso> toDomainMenuIso(Set<MenuIsoEntity> entities) {
        return convertCollection(entities, this::toDomainMenuIso);
    }

    public Set<MenuIsoEntity> toEntityMenuIso(Set<MenuIso> entities) {
        return convertCollection(entities, this::toEntityMenuIso);
    }

    public Menu toDomain(MenuEntity entity) {
        return Menu.builder()
                .id(entity.getId())
                .mainId(entity.getMain().getId())
                .icon(entity.getIcon())
                .menuUrl(entity.getMenuUrl())
                .side(entity.getSide())
                .layout(entity.getLayout())
                .panelOn(entity.getPanelOn())
                .searchOn(entity.getSearchOn())
                .image(entity.getImageContent())
                .hideMenuPanelIfOne(entity.getHideMenuPanelIfOne())
                .orderNum(entity.getOrderNum())
                .panels(panelMapper.toDomain(entity.getPanels()))
                .iso(toDomainMenuIso(entity.getIso()))
                .createdOn(entity.getCreatedOn())
                .createdBy(entity.getCreatedBy())
                .modifiedOn(entity.getModifiedOn())
                .modifiedBy(entity.getModifiedBy())
                .build();
    }

    public MenuEntity toEntity(Menu menu) {
        return MenuEntity.builder()
                .id(menu.getId())
                .iso(toEntityMenuIso(menu.getIso()))
                .icon(menu.getIcon())
                .side(menu.getSide())
                .layout(menu.getLayout())
                .panelOn(menu.getPanelOn())
                .searchOn(menu.getSearchOn())
                .hideMenuPanelIfOne(menu.getHideMenuPanelIfOne())
                .orderNum(menu.getOrderNum())
                .panels(panelMapper.toEntity(menu.getPanels()))
                .build();
    }

    public void updateEntityByModel(MenuEntity entity, Menu menu) {
       if(menu.getIso() != null) {
           entity.setIso(toEntityMenuIso(menu.getIso()));
       }

        entity.setSide(menu.getSide());
        entity.setLayout(menu.getLayout());
        entity.setPanelOn(menu.getPanelOn());
        entity.setHideMenuPanelIfOne(menu.getHideMenuPanelIfOne());
        entity.setOrderNum(menu.getOrderNum());
        entity.setIcon(menu.getIcon());

        if(menu.getPanels() != null) {
            entity.setPanels(panelMapper.toEntity(menu.getPanels()));
        }
    }

    public MenuIso toDomainMenuIso(MenuIsoEntity entity) {
        return MenuIso.builder()
                .iso(entity.getIso().getCountryCode())
                .title(entity.getTitle())
                .description(entity.getDescription())
                .build();
    }

    public MenuIsoEntity toEntityMenuIso(MenuIso domain) {
        return MenuIsoEntity.builder()
                .iso(Country.fromCode(domain.getIso()))
                .title(domain.getTitle())
                .description(domain.getDescription())
                .build();
    }
}

