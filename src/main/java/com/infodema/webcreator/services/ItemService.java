package com.infodema.webcreator.services;

import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.persistance.entities.item.ItemEntity;
import com.infodema.webcreator.persistance.repositories.DetailRepository;
import com.infodema.webcreator.persistance.repositories.ItemRepository;
import com.infodema.webcreator.domain.core.Item;
import com.infodema.webcreator.domain.mappers.ItemMapper;
import com.infodema.webcreator.domain.enums.Chip;
import com.infodema.webcreator.persistance.repositories.security.RoleRepository;
import com.infodema.webcreator.persistance.repositories.security.UserRepository;
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
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;

    @Transactional
    public Item newItem(Long detailId, Item payload, MultipartFile file) {
        log.info("Adding Item to Detail {}", detailId);
        log.info("Adding Item to Detail payload {}", payload.toString());
        DetailEntity detailEntity = detailRepository.findById(detailId)
                .orElseThrow(() -> new EntityNotFoundException("No detail found with ID:: " + detailId));

        ItemEntity itemEntityNew = itemMapper.toEntity(payload);
        if(payload.getChip().equals(Chip.PICTURE)){
            itemEntityNew.setImage(file);
            itemEntityNew.setMinHeight(400);
        }
        if(payload.getChip().equals(Chip.VIDEO)){
            itemEntityNew.setMinHeight(400);
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

        itemMapper.updateEntityByModel(entity, payload, file);
        ItemEntity item = itemRepository.save(entity);
        return itemMapper.toDomain(item);
    }

    public void deleteItemById(Long itemId) {
        log.info("Deleting item from {}", itemId);
        itemRepository.deleteById(itemId);
    }

}


