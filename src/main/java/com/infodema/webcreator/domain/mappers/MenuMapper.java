package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.*;
import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuIsoEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuPropertyEntity;
import com.infodema.webcreator.persistance.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class MenuMapper extends AbstractMapper {

    private final PanelMapper panelMapper;
    private final ProductRepository productRepository;

    public List<Menu> toDomain(List<MenuEntity> entities) {
        return convertCollection(entities, this::toDomain);
    }

    public Set<MenuIso> toDomainMenuIso(Set<MenuIsoEntity> entities) {
        return convertCollection(entities, this::toDomainMenuIso);
    }

    public Set<MenuIsoEntity> toEntityMenuIso(Set<MenuIso> entities) {
        return convertCollection(entities, this::toEntityMenuIso);
    }

    public Set<MenuProperty> toDomainMenuProperty(Set<MenuPropertyEntity> entities) {
        return convertCollection(entities, this::toDomainMenuProperty);
    }

    public Set<MenuPropertyEntity> toEntityMenuProperty(Set<MenuProperty> entities) {
        return convertCollection(entities, this::toEntityMenuProperty);
    }

    public Menu toDomain(MenuEntity entity) {
        return Menu.builder()
                .id(entity.getId())
                .mainId(entity.getMain().getId())
                .productId(entity.getProduct() != null ? entity.getProduct().getId() : null)
                .icon(entity.getIcon())
                .menuUrl(entity.getMenuUrl())
                .side(entity.getSide())
                .layout(entity.getLayout())
                .type(entity.getTopMenuType())
                .panelOn(entity.getPanelOn())
                .searchOn(entity.getSearchOn())
                .image(entity.getImageContent())
                .hideMenuPanelIfOne(entity.getHideMenuPanelIfOne())
                .orderNum(entity.getOrderNum())
                .panels(panelMapper.toDomain(entity.getPanels()))
                .iso(toDomainMenuIso(entity.getIso()))
                .properties(toDomainMenuProperty(entity.getMenuProperties()))
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
                .menuProperties(toEntityMenuProperty(menu.getProperties()))
                .icon(menu.getIcon())
                .menuUrl(menu.getMenuUrl())
                .side(menu.getSide())
                .layout(menu.getLayout())
                .product(menu.getProductId() != null ? productRepository.findById(menu.getProductId()).orElseThrow(): null)
                .topMenuType(menu.getType())
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
        if(menu.getProperties() != null) {
            entity.setMenuProperties(toEntityMenuProperty(menu.getProperties()));
        }
        entity.setMenuUrl(menu.getMenuUrl());
        entity.setSide(menu.getSide());
        entity.setLayout(menu.getLayout());
        entity.setTopMenuType(menu.getType());
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

    public MenuProperty toDomainMenuProperty(MenuPropertyEntity entity) {
        return MenuProperty.builder()
                .name(entity.getName())
                .value(entity.getValue())
                .build();
    }

    public MenuPropertyEntity toEntityMenuProperty(MenuProperty domain) {
        return MenuPropertyEntity.builder()
                .name(domain.getName())
                .value(domain.getValue())
                .build();
    }
}

