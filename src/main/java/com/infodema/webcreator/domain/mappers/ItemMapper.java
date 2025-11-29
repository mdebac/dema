package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.Item;
import com.infodema.webcreator.domain.enums.Chip;
import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.item.ItemEntity;
import com.infodema.webcreator.domain.core.ItemIso;
import com.infodema.webcreator.persistance.entities.item.ItemIsoEntity;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ItemMapper extends AbstractMapper {

    public List<Item> toDomain(List<ItemEntity> entities) {
        return convertCollection(entities, this::toDomain);
    }

    public Set<ItemIso> toDomainItemIso(Set<ItemIsoEntity> entities) {
        return convertCollection(entities, this::toDomainItemIso);
    }
    public Set<ItemIsoEntity> toEntityItemIso(Set<ItemIso> entities) {
        return convertCollection(entities, this::toEntityItemIso);
    }

    @SneakyThrows
    public Item toDomain(ItemEntity entity) {

        return Item.builder()
                .id(entity.getId())
                .rowSpan(entity.getRowSpan())
                .colSpan(entity.getColSpan())
                .orderNum(entity.getOrderNum())
                .cornerRadius(entity.getCornerRadius())
                .backgroundColor(entity.getBackgroundColor())
                .minHeight(entity.getMinHeight())
                .iso(toDomainItemIso(entity.getIso()))
                .shadowColor(entity.getShadowColor())
                .url(entity.getUrl())
                .chip(entity.getChip())
                .image(entity.getContent() != null ? entity.getContent() : null)
                .detailId((entity.getDetail().getId()))
                .createdOn(entity.getCreatedOn())
                .createdBy(entity.getCreatedBy())
                .modifiedOn(entity.getModifiedOn())
                .modifiedBy(entity.getModifiedBy())
               .build();
    }

    public List<ItemEntity> toEntity(List<Item> models) {
        return convertCollection(models, this::toEntity);
    }

    public ItemEntity toEntity(Item item) {

        ItemEntity newItemEntity = new ItemEntity();
        newItemEntity.setChip(item.getChip());
        newItemEntity.setId(item.getId());
        newItemEntity.setRowSpan(item.getRowSpan());
        newItemEntity.setOrderNum(item.getOrderNum());
        newItemEntity.setColSpan(item.getColSpan());
        newItemEntity.setCornerRadius(item.getCornerRadius());
        newItemEntity.setBackgroundColor(item.getBackgroundColor());
        newItemEntity.setMinHeight(item.getMinHeight());
        newItemEntity.setShadowColor(item.getShadowColor());
        newItemEntity.setIso(toEntityItemIso(item.getIso()));
        newItemEntity.setUrl(item.getUrl());
        newItemEntity.setCreatedOn(item.getCreatedOn());
        newItemEntity.setCreatedBy(item.getCreatedBy());
        newItemEntity.setModifiedOn(item.getModifiedOn());
        newItemEntity.setModifiedBy(item.getModifiedBy());

        return newItemEntity;
    }

    //no id, and detailId
    public void updateEntityByModel(ItemEntity entity, Item item, MultipartFile file) {

        if(item.getChip() == Chip.SETTINGS){
            entity.setRowSpan(item.getRowSpan());
            entity.setColSpan(item.getColSpan());
            entity.setCornerRadius(item.getCornerRadius());
            entity.setBackgroundColor(item.getBackgroundColor());
            entity.setShadowColor(item.getShadowColor());
            entity.setMinHeight(item.getMinHeight());
        }
        if(item.getChip() != Chip.SETTINGS) {
            entity.setChip(item.getChip());
        }

        if(item.getChip().equals(Chip.PICTURE)){
            entity.setImage(file);
            entity.setIso(toEntityItemIso(item.getIso()));
        }

        if(item.getChip().equals(Chip.TEXT) || item.getChip().equals(Chip.JOB)){
            entity.setIso(toEntityItemIso(item.getIso()));
        }

        if(item.getChip().equals(Chip.VIDEO)){
            entity.setUrl(item.getUrl());
        }

        entity.setCreatedBy(entity.getCreatedBy());
        entity.setCreatedOn(entity.getCreatedOn());
        entity.setModifiedOn(entity.getModifiedOn());
        entity.setModifiedBy(entity.getModifiedBy());
    }

    public ItemIso toDomainItemIso(ItemIsoEntity entity) {
        return ItemIso.builder()
                .iso(entity.getIso().getCountryCode())
                .description(entity.getDescription())
                .title(entity.getTitle())
                .build();
    }

    public ItemIsoEntity toEntityItemIso(ItemIso domain) {
        return ItemIsoEntity.builder()
                .iso(Country.fromCode(domain.getIso()))
                .description(domain.getDescription())
                .title(domain.getTitle())
                .build();
    }
}

