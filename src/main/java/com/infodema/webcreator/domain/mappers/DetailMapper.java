package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.Detail;
import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.domain.core.DetailIso;
import com.infodema.webcreator.persistance.entities.detail.DetailIsoEntity;
import com.infodema.webcreator.domain.enums.Country;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DetailMapper extends AbstractMapper {

    private final ItemMapper itemMapper;
    private final MenuMapper menuMapper;
    private final PanelMapper panelMapper;

    public List<Detail> toDomain(List<DetailEntity> entities) {
        return convertCollection(entities, this::toDomain);
    }

    public Set<DetailIso> toDomainDetailIso(Set<DetailIsoEntity> entities) {
        return convertCollection(entities, this::toDomainDetailIso);
    }

    public Set<DetailIsoEntity> toEntityDetailIso(Set<DetailIso> entities) {
        return convertCollection(entities, this::toEntityDetailIso);
    }

    public Detail toDomain(DetailEntity entity) {
        return Detail.builder()
                .id(entity.getId())
                .show(entity.getShowProgram())
                .columns(entity.getColumns())
                .backgroundColorOn(entity.isBackgroundColorOn())
                .cornerRadius(entity.getCornerRadius())
                .items(itemMapper.toDomain(entity.getItems()))
                .iso(toDomainDetailIso(entity.getIso()))
                .createdOn(entity.getCreatedOn())
                .createdBy(entity.getCreatedBy())
                .modifiedOn(entity.getModifiedOn())
                .modifiedBy(entity.getModifiedBy())
                .menu(menuMapper.toDomain(entity.getMenu()))
                .panel(panelMapper.toDomain(entity.getPanel()))
                .build();
    }

    public List<DetailEntity> toEntity(List<Detail> models) {
        return convertCollection(models, this::toEntity);
    }

    public DetailEntity toEntity(Detail detail) {
        return DetailEntity.builder()
                .id(detail.getId())
                .iso(toEntityDetailIso(detail.getIso()))
                .showProgram(detail.isShow())
                .columns(detail.getColumns())
                .backgroundColorOn(detail.isBackgroundColorOn())
                .cornerRadius(detail.getCornerRadius())
                .items(itemMapper.toEntity(detail.getItems()))
                .createdOn(detail.getCreatedOn())
                .createdBy(detail.getCreatedBy())
                .modifiedOn(detail.getModifiedOn())
                .modifiedBy(detail.getModifiedBy())
                .build();
    }

    //no id, and apartmentId
    public void updateEntityByModel(DetailEntity entity, Detail detail) {

       if(detail.getIso() != null) {
           entity.setIso(toEntityDetailIso(detail.getIso()));
        }
        entity.setShowProgram(detail.isShow());
        entity.setColumns(detail.getColumns());
        entity.setBackgroundColorOn(detail.isBackgroundColorOn());
        entity.setCornerRadius(detail.getCornerRadius());

        if(detail.getItems() != null) {
            entity.setItems(itemMapper.toEntity(detail.getItems()));
        }
        entity.setCreatedBy(entity.getCreatedBy());
        entity.setCreatedOn(entity.getCreatedOn());
        entity.setModifiedOn(entity.getModifiedOn());
        entity.setModifiedBy(entity.getModifiedBy());
    }

    public DetailIso toDomainDetailIso(DetailIsoEntity entity) {
        return DetailIso.builder()
                .iso(entity.getIso().getCountryCode())
                .label(entity.getLabel())
                .title(entity.getTitle())
                .build();
    }

    public DetailIsoEntity toEntityDetailIso(DetailIso domain) {
        return DetailIsoEntity.builder()
                .iso(Country.fromCode(domain.getIso()))
                .label(domain.getLabel())
                .title(domain.getTitle())
                .build();
    }
}

