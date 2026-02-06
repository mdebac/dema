package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.core.*;
import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.domain.enums.SideMenuType;
import com.infodema.webcreator.domain.mappers.DetailMapper;
import com.infodema.webcreator.domain.mappers.MenuMapper;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelIsoEntity;
import com.infodema.webcreator.persistance.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class DetailsService {
    private static final String NOT_FOUND = "Details was not found";

    private final MainRepository mainRepository;
    private final MenuRepository menuRepository;
    private final PanelRepository panelRepository;
    private final ItemRepository itemRepository;
    private final DetailRepository detailRepository;
    private final DetailMapper detailMapper;
    private final MenuMapper menuMapper;
    private final MenuService menuService;
    private final PanelService panelService;


    @Transactional
    public Detail createHotel(Detail payload, MultipartFile topMenuImageFile) {

        Menu menu;
        if (payload.getTopMenu().getId() == null) {

            Integer currentMaxOrderNum = menuRepository.findMaxOrderNum(payload.getTopMenu().getMainId());
            if (currentMaxOrderNum == null) {
                payload.getTopMenu().setOrderNum(1);
            } else {
                payload.getTopMenu().setOrderNum(currentMaxOrderNum + 1);
            }
            menu = menuService.addMenu(payload.getTopMenu(), topMenuImageFile);

        } else {
            menu = menuService.updateMenu(payload.getTopMenu().getId(), payload.getTopMenu(), topMenuImageFile);
        }


        Set<PanelIsoEntity> panelGalleryIso = new HashSet<PanelIsoEntity>();
        panelGalleryIso.add(
                PanelIsoEntity.builder()
                        .iso(Country.fromCode("GB-eng"))
                        .title("<p><span class=\"ql-font-caesarDressing\" style=\"font-size: 2.3em;\">Photos</span></p>")
                        .description("description")
                        .build());
        panelGalleryIso.add(
                PanelIsoEntity.builder()
                        .iso(Country.fromCode("HR"))
                        .title("<p><span class=\"ql-font-caesarDressing\" style=\"font-size: 2.3em;\">Slike</span></p>")
                        .description("description")
                        .build());

        Set<PanelIsoEntity> panelLocationIso = new HashSet<PanelIsoEntity>();
        panelLocationIso.add(
                PanelIsoEntity.builder()
                        .iso(Country.fromCode("GB-eng"))
                        .title("<p><span class=\"ql-font-caesarDressing\" style=\"font-size: 2.3em;\">Location</span></p>")
                        .description("description")
                        .build());
        panelLocationIso.add(
                PanelIsoEntity.builder()
                        .iso(Country.fromCode("HR"))
                        .title("<p><span class=\"ql-font-caesarDressing\" style=\"font-size: 2.3em;\">Lokacija</span></p>")
                        .description("description")
                        .build());

        Set<PanelIsoEntity> panelReservationsIso = new HashSet<PanelIsoEntity>();
        panelReservationsIso.add(
                PanelIsoEntity.builder()
                        .iso(Country.fromCode("GB-eng"))
                        .title("<p><span class=\"ql-font-caesarDressing\" style=\"font-size: 2.3em;\">Booking</span></p>")
                        .description("description")
                        .build());
        panelReservationsIso.add(
                PanelIsoEntity.builder()
                        .iso(Country.fromCode("HR"))
                        .title("<p><span class=\"ql-font-caesarDressing\" style=\"font-size: 2.3em;\">Rezervacije</span></p>")
                        .description("description")
                        .build());


        Set<PanelIsoEntity> panelAccessoriesIso = new HashSet<PanelIsoEntity>();
        panelAccessoriesIso.add(
                PanelIsoEntity.builder()
                        .iso(Country.fromCode("GB-eng"))
                        .title("<p><span class=\"ql-font-caesarDressing\" style=\"font-size: 2.3em;\">Accessories</span></p>")
                        .description("description")
                        .build());
        panelAccessoriesIso.add(
                PanelIsoEntity.builder()
                        .iso(Country.fromCode("HR"))
                        .title("<p><span class=\"ql-font-caesarDressing\" style=\"font-size: 2.3em;\">Sadržaj</span></p>")
                        .description("description")
                        .build());


        MenuEntity menuEntity = menuRepository.findById(menu.getId())
                .orElseThrow(() -> new EntityNotFoundException("No Menu found with ID:: " + menu.getId()));

        PanelEntity panelAccessories = PanelEntity.builder()
                .panelUrl("accessories")
                .sideMenuType(SideMenuType.ACCESSORIES)
                .iso(panelAccessoriesIso)
                .menu(menuEntity)
                .orderNum(1)
                .build();

        PanelEntity panelReservations = PanelEntity.builder()
                .panelUrl("reservations")
                .sideMenuType(SideMenuType.RESERVATIONS)
                .iso(panelReservationsIso)
                .menu(menuEntity)
                .orderNum(2)
                .build();

        PanelEntity panelLocation = PanelEntity.builder()
                .panelUrl("location")
                .sideMenuType(SideMenuType.LOCATION)
                .iso(panelLocationIso)
                .menu(menuEntity)
                .orderNum(3)
                .build();

        PanelEntity panelGallery = PanelEntity.builder()
                .panelUrl("gallery")
                .sideMenuType(SideMenuType.GALLERY)
                .iso(panelGalleryIso)
                .menu(menuEntity)
                .orderNum(4)
                .build();

        DetailEntity activeDetail = hotelPanel(panelGallery, menuEntity, payload);
        hotelPanel(panelAccessories, menuEntity, payload);
        hotelPanel(panelLocation, menuEntity, payload);
        hotelPanel(panelReservations, menuEntity, payload);

        return detailMapper.toDomain(activeDetail);


//        if (payload.getSideMenu().getId() == null) {
//
//            Integer currentMaxOrderNum = panelRepository.findMaxOrderNum(menu.getId());
//            if(currentMaxOrderNum == null){
//                payload.getSideMenu().setOrderNum(1);
//            }else{
//                payload.getSideMenu().setOrderNum(currentMaxOrderNum + 1);
//            }
//
        //    panel = panelService.addPanel(menu.getId(), payload.getSideMenu(), null);
//        } else {
//            panel = panelService.updatePanel(menu.getId(), payload.getSideMenu(), sideMenuImageFile);
//        }
//
//        if (payload.getId() == null) {
//            return addDetail(menu.getId(), panel.getId(), payload);
//        } else {
//            return updateDetail(payload, topMenuImageFile, sideMenuImageFile);
//        }
        // return addDetail(menu.getId(), panel.getId(), payload);
    }

    private DetailEntity hotelPanel(PanelEntity panel, MenuEntity menu, Detail payload) {

        Integer currentMaxOrder = panelRepository.findMaxOrderNum(menu.getId());
        if (currentMaxOrder == null) {
            panel.setOrderNum(1);
        } else {
            panel.setOrderNum(currentMaxOrder + 1);
        }
        panelRepository.save(panel);

        DetailEntity pageEntity = detailMapper.toEntity(payload);
        pageEntity.setPanel(panel);
        pageEntity.setMenu(menu);
        return detailRepository.save(pageEntity);
    }

    @Transactional
    public Detail create(Detail payload, MultipartFile topMenuImageFile, MultipartFile sideMenuImageFile) {

        Menu menu;
        if (payload.getTopMenu().getId() == null) {

            Integer currentMaxOrderNum = menuRepository.findMaxOrderNum(payload.getTopMenu().getMainId());
            if (currentMaxOrderNum == null) {
                payload.getTopMenu().setOrderNum(1);
            } else {
                payload.getTopMenu().setOrderNum(currentMaxOrderNum + 1);
            }
            menu = menuService.addMenu(payload.getTopMenu(), topMenuImageFile);

        } else {
            menu = menuService.updateMenu(payload.getTopMenu().getId(), payload.getTopMenu(), topMenuImageFile);
        }

        Panel panel;
        if (payload.getSideMenu().getId() == null) {

            Integer currentMaxOrderNum = panelRepository.findMaxOrderNum(menu.getId());
            if (currentMaxOrderNum == null) {
                payload.getSideMenu().setOrderNum(1);
            } else {
                payload.getSideMenu().setOrderNum(currentMaxOrderNum + 1);
            }

            panel = panelService.addPanel(menu.getId(), payload.getSideMenu(), sideMenuImageFile);
        } else {
            panel = panelService.updatePanel(menu.getId(), payload.getSideMenu(), sideMenuImageFile);
        }

        if (payload.getId() == null) {
            return addDetail(menu.getId(), panel.getId(), payload);
        } else {
            return updateDetail(payload, topMenuImageFile, sideMenuImageFile);
        }

    }

    @Transactional
    public Detail addDetail(Long menuId, Long panelId, Detail payload) {

        if (menuId == null || panelId == null) {
            throw new RuntimeException(NOT_FOUND);
        }

        log.info("Adding Detail to menuId {}, panelId {}", menuId, panelId);

        MenuEntity menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new EntityNotFoundException("No Menu found with ID:: " + menuId));

        PanelEntity panel = panelRepository.findById(panelId)
                .orElseThrow(() -> new EntityNotFoundException("No Panel found with ID:: " + panelId));

        DetailEntity detailEntity = detailMapper.toEntity(payload);
        detailEntity.setMenu(menu);
        detailEntity.setPanel(panel);

        detailRepository.save(detailEntity);
        return detailMapper.toDomain(detailEntity);

    }

    @Transactional
    public void removeDetail(Long mainId, Long detailId) {
        log.info("Removing detail {}", detailId);

        DetailEntity detail = detailRepository.findById(detailId).orElseThrow(() -> new EntityNotFoundException("No Detail found with ID:: " + detailId));

        Long panelId = detail.getPanel().getId();
        Long menuId = detail.getMenu().getId();

        if (menuRepository.countByMain_Id(mainId) == 1) {
            if (panelRepository.countByMenu_Id(menuId) == 1) {
                throw new RuntimeException("Minimum one");
            } else {
                itemRepository.deleteByDetail_Id(detailId);
                detailRepository.deleteById(detailId);
                panelService.removePanel(menuId, panelId, detailId);
            }
        } else {
            itemRepository.deleteByDetail_Id(detailId);
            detailRepository.deleteById(detailId);
            if (panelRepository.countByMenu_Id(menuId) == 1) {
                menuService.removeMenu(mainId, menuId);
            } else {
                panelRepository.deleteById(panelId);
            }
        }
    }

    @Transactional
    public Detail updateDetail(Detail payload, MultipartFile topMenuImageFile, MultipartFile sideMenuImageFile) {
        log.info("Updating Detail {}", payload.getId());

        menuService.updateMenu(payload.getTopMenu().getId(), payload.getTopMenu(), topMenuImageFile);
        panelService.updatePanel(payload.getSideMenu().getId(), payload.getSideMenu(), sideMenuImageFile);

        DetailEntity entity = detailRepository.findById(payload.getId()).orElseThrow(() -> new EntityNotFoundException(NOT_FOUND));

        detailMapper.updateEntityByModel(entity, payload);

        return detailMapper.toDomain(detailRepository.save(entity));
    }


    @Transactional
    public Menu updateMenuInMain(Long mainId, Long id, Menu payload) {
        log.info("Updating Menu {} from Main {}", id, mainId);

        MenuEntity entity = menuRepository.findById(id).orElseThrow(() -> {
            log.warn("Menu {} was not found for updating in Main {}", id, mainId);
            return new RuntimeException(NOT_FOUND);
        });

        entity.setSide(payload.getSide());
        entity.setLayout(payload.getLayout());
        if (!entity.getMain().getId().equals(mainId)) {
            log.warn("Menu {} does not belong to Main {}", id, mainId);
            throw new RuntimeException("Menu does not belong to Main");
        }

        menuMapper.updateEntityByModel(entity, payload);
        return menuMapper.toDomain(menuRepository.save(entity));
    }

    public void deleteAll(Long menuId) {
        log.info("Deleting all details from Menu id {}", menuId);
        detailRepository.deleteByMenu_Id(menuId);
    }

    @Transactional(readOnly = true)
    public Detail findDetailByUrlLabels(String host, String menuUrl, String menuPanelUrl) {
        MainEntity mainHostEntity = mainRepository.findByHost(host)
                .orElseThrow(() -> new RuntimeException("Main was not found with label [" + host + "]"));
        MenuEntity menu = mainHostEntity.getMenus().stream().filter(a -> a.getMenuUrl().equals(menuUrl)).findFirst().orElseThrow(() -> new RuntimeException("first Menu was not found with menuUrl [" + menuUrl + "]"));
        PanelEntity panel = null;
        if (menuPanelUrl != null && !menuPanelUrl.isEmpty()) {
            panel = menu.getPanels().stream().filter(a -> a.getPanelUrl().equals(menuPanelUrl)).findFirst().orElseThrow(() -> new RuntimeException("first Panel was not found with panelUrl [" + menuPanelUrl + "]"));

        } else {
            panel = menu.getPanels().stream().min(Comparator.comparingInt(PanelEntity::getOrderNum)).orElseThrow(() -> new RuntimeException("first Panel was not found"));
        }

        if (panel != null) {
            PanelEntity finalPanel = panel;
            return detailMapper.toDomain(
                    detailRepository.findByMenu_IdAndPanel_Id(menu.getId(), panel.getId()).orElseThrow(() -> new RuntimeException("Detail was not found by menu [" + menu.getId() + "] and panel [" + finalPanel.getId() + "]"))

            );
        } else {
            return null;
        }

    }

    @Transactional(readOnly = true)
    public Detail findDetailByDetailId(Long detailId) {
        return detailMapper.toDomain(detailRepository.findById(detailId).orElseThrow(() -> new RuntimeException("Detail was not found with detailId [" + detailId + "]")));
    }
}


