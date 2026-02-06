package com.infodema.webcreator.services;

import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.persistance.entities.item.ItemEntity;
import com.infodema.webcreator.persistance.repositories.DetailRepository;
import com.infodema.webcreator.persistance.repositories.ItemRepository;
import com.infodema.webcreator.domain.core.Item;
import com.infodema.webcreator.domain.mappers.ItemMapper;
import com.infodema.webcreator.domain.enums.Chip;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


@Service
@RequiredArgsConstructor
@Slf4j
public class ItemService {
    private static final String NOT_FOUND = "Details was not found";

    private final DetailRepository detailRepository;
    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;

    @Transactional
    public Item newItem(Long detailId, Item payload, MultipartFile file) {
        log.info("Adding Item to Detail {}", detailId);
        log.info("Adding Item to Detail payload {}", payload.toString());
        DetailEntity detailEntity = detailRepository.findById(detailId)
                .orElseThrow(() -> new EntityNotFoundException("No detail found with ID:: " + detailId));

        //System.out.println("Order: " + itemRepository.findMaxOrderNum(detailId));
        Integer currentMaxOrderNum = itemRepository.findMaxOrderNum(detailId);
        if(currentMaxOrderNum == null){
            payload.setOrderNum(1);
        }else{
            payload.setOrderNum(currentMaxOrderNum + 1);
        }

        ItemEntity itemEntityNew = itemMapper.toEntity(payload);
        if(payload.getChip().equals(Chip.PICTURE)){
            itemEntityNew.setImage(file);
            itemEntityNew.setMinHeight(400);
        }
        if(payload.getChip().equals(Chip.VIDEO)){
            itemEntityNew.setMinHeight(300);
        }
        itemEntityNew.setDetail(detailEntity);

        ItemEntity itemEntity = itemRepository.save(itemEntityNew);
        return itemMapper.toDomain(itemEntity);
    }

    public void removeItem(Long id) {
        log.info("Removing item {}", id);
        itemRepository.deleteById(id);
    }

    @Transactional
    public Item updateItem(Long detailId, Item payload, MultipartFile file) {
        log.info("Updating Item {} from Detail {}", payload.getId(), detailId);

        ItemEntity entity = itemRepository.findById(payload.getId()).orElseThrow(() -> {
            log.warn("Item {} was not found in detail {}", payload.getId(), detailId);
            return new RuntimeException(NOT_FOUND);
        });

        if(payload.getChip() == Chip.MOVE_LEFT){
            ItemEntity beforeEntity = itemRepository.findById(payload.getBeforeItemId()).orElseThrow(() -> {
                log.warn("beforeEntity {} was not found", payload.getBeforeItemId());
                return new RuntimeException(NOT_FOUND);
            });
            Integer beforeOrderNum = beforeEntity.getOrderNum();
            Integer currentOrderNum = entity.getOrderNum();
            entity.setOrderNum(beforeOrderNum);
            beforeEntity.setOrderNum(currentOrderNum);
            itemRepository.save(beforeEntity);
        }

        if(payload.getChip() == Chip.MOVE_RIGHT){
            ItemEntity nextEntity = itemRepository.findById(payload.getNextItemId()).orElseThrow(() -> {
                log.warn("nextEntity {} was not found", payload.getNextItemId());
                return new RuntimeException(NOT_FOUND);
            });
            Integer nextOrderNum = nextEntity.getOrderNum();
            Integer currentOrderNum = entity.getOrderNum();
            entity.setOrderNum(nextOrderNum);
            nextEntity.setOrderNum(currentOrderNum);
            itemRepository.save(nextEntity);
        }

        itemMapper.updateEntityByModel(entity, payload, file);
        ItemEntity item = itemRepository.save(entity);
        return itemMapper.toDomain(item);
    }

    public void deleteItemById(Long itemId) {
        log.info("Deleting item from {}", itemId);
        itemRepository.deleteById(itemId);
    }

}


