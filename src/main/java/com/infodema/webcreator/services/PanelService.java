package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.core.Panel;
import com.infodema.webcreator.domain.mappers.PanelMapper;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import com.infodema.webcreator.persistance.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Panel addPanel(Long menuId, Panel payload) {
        log.info("Adding Panel to menuId {}", menuId);

        MenuEntity menuEntity = menuRepository.findById(menuId)
                .orElseThrow(() -> new EntityNotFoundException("No Menu found with ID:: " + menuId));

        PanelEntity panelEntity = panelMapper.toEntity(payload);
        panelEntity.setMenu(menuEntity);

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
    public Panel updatePanel(Long id, Panel payload) {

        PanelEntity entity = panelRepository.findById(id).orElseThrow(() -> {
            log.warn("Panel with id {} was not found for updating", id);
            return new RuntimeException(NOT_FOUND);
        });

        panelMapper.updateEntityByModel(entity, payload);
        return panelMapper.toDomain(panelRepository.save(entity));
    }

    public void deleteAll(Long menuId) {
        log.info("Deleting all Panels from Menu id {}", menuId);
        panelRepository.deleteByMenu_Id(menuId);
    }

}



