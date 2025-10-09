package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.mappers.MenuMapper;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.domain.core.Menu;
import com.infodema.webcreator.persistance.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {
    private static final String NOT_FOUND = "Menus was not found";

    private final MainRepository mainRepository;
    private final MenuRepository menuRepository;
    private final PanelRepository panelRepository;
    private final MenuMapper menuMapper;

    @Transactional
    public Menu addMenu(Menu payload) {

        MainEntity mainEntity = mainRepository.findById(payload.getMainId())
                .orElseThrow(() -> new EntityNotFoundException("No Main found with ID:: " + payload.getMainId()));

        MenuEntity menuEntity = menuMapper.toEntity(payload);
        menuEntity.setMain(mainEntity);

        menuRepository.save(menuEntity);
        return menuMapper.toDomain(menuEntity);
    }

    @Transactional
    public void removeMenu(Long mainId, Long id) {
        log.info("Removing main {} from Main {}", id, mainId);

        if (menuRepository.countByMain_Id(mainId) == 1) {
            throw new RuntimeException("Cant delete, Min one");
        }

        panelRepository.deleteByMenu_Id(id);
        menuRepository.deleteById(id);
    }


    @Transactional
    public Menu updateMenu(Long id, Menu payload) {

        MenuEntity entity = menuRepository.findById(id).orElseThrow(() -> {
            log.warn("Menu with id {} was not found", id);
            return new RuntimeException(NOT_FOUND);
        });

        menuMapper.updateEntityByModel(entity, payload);
        return menuMapper.toDomain(menuRepository.save(entity));
    }

    public void deleteAll(Long mainId) {
        log.info("Deleting all menus from Main id {}", mainId);
        menuRepository.deleteByMain_Id(mainId);
    }

}



