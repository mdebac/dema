package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.core.Panel;
import com.infodema.webcreator.domain.mappers.PanelMapper;
import com.infodema.webcreator.persistance.entities.item.ItemEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import com.infodema.webcreator.persistance.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class PanelService {
    private static final String NOT_FOUND = "Panels was not found";

    private final MenuRepository menuRepository;
    private final PanelRepository panelRepository;
    private final PanelMapper panelMapper;
    private final ItemRepository itemRepository;
    private final DetailRepository detailRepository;

    @Transactional
    public Panel addPanel(Long menuId, Panel payload, MultipartFile file) {
        log.info("Adding Panel to menuId {}", menuId);

        MenuEntity menuEntity = menuRepository.findById(menuId)
                .orElseThrow(() -> new EntityNotFoundException("No Menu found with ID:: " + menuId));

        PanelEntity panelEntity = panelMapper.toEntity(payload);
        panelEntity.setMenu(menuEntity);

        if (payload.getRemoveImage() != null && payload.getRemoveImage() == Boolean.TRUE) {
            panelEntity.setImage(null);
        } else {
            if (file != null) {
                panelEntity.setImage(file);
            }
        }

        panelRepository.save(panelEntity);
        return panelMapper.toDomain(panelEntity);
    }

    @Transactional
    public void removePanel(Long menuId, Long panelId, Long detailId) {
        log.info("Removing Panel {} from Menu {} with Detail {}", panelId, menuId, detailId);

        if (panelRepository.countByMenu_Id(menuId) == 1) {
            throw new RuntimeException("Cant delete, Min one");
        }

        itemRepository.deleteByDetail_Id(detailId);
        detailRepository.deleteById(detailId);
        panelRepository.deleteById(panelId);
    }

    @Transactional
    public Panel updatePanel(Long id, Panel sideMenu, MultipartFile file) {

        PanelEntity entity = panelRepository.findById(id).orElseThrow(() -> {
            log.warn("Panel with id {} was not found for updating", id);
            return new RuntimeException(NOT_FOUND);
        });

        if (sideMenu.getRemoveImage() != null && sideMenu.getRemoveImage()) {
            entity.setImage(null);
        } else {
            if (file != null) {
                entity.setImage(file);
            }
        }

        panelMapper.updateEntityByModel(entity, sideMenu);
        return panelMapper.toDomain(panelRepository.save(entity));
    }

    @Transactional
    public void moveSideMenuUp(Panel payload) {
        PanelEntity beforeEntity = panelRepository.findById(payload.getBeforeId()).orElseThrow(() -> {
            log.warn("before PanelEntity {} was not found", payload.getBeforeId());
            return new RuntimeException(NOT_FOUND);
        });
        PanelEntity entity = panelRepository.findById(payload.getId()).orElseThrow(() -> {
            log.warn("current PanelEntity {} was not found", payload.getId());
            return new RuntimeException(NOT_FOUND);
        });
        Integer beforeOrderNum = beforeEntity.getOrderNum();
        Integer currentOrderNum = entity.getOrderNum();
        entity.setOrderNum(beforeOrderNum);
        beforeEntity.setOrderNum(currentOrderNum);
        panelRepository.save(beforeEntity);
        panelRepository.save(entity);
    }

    @Transactional
    public void moveSideMenuDown(Panel payload) {
        PanelEntity nextEntity = panelRepository.findById(payload.getNextId()).orElseThrow(() -> {
            log.warn("next PanelEntity {} was not found", payload.getNextId());
            return new RuntimeException(NOT_FOUND);
        });
        PanelEntity entity = panelRepository.findById(payload.getId()).orElseThrow(() -> {
            log.warn("current PanelEntity {} was not found", payload.getId());
            return new RuntimeException(NOT_FOUND);
        });
        Integer beforeOrderNum = nextEntity.getOrderNum();
        Integer currentOrderNum = entity.getOrderNum();
        entity.setOrderNum(beforeOrderNum);
        panelRepository.save(entity);

        nextEntity.setOrderNum(currentOrderNum);
        panelRepository.save(nextEntity);
    }


    public void deleteAll(Long menuId) {
        log.info("Deleting all Panels from Menu id {}", menuId);
        panelRepository.deleteByMenu_Id(menuId);
    }



}



