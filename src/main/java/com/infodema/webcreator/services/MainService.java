package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.core.*;
import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.domain.enums.Layout;
import com.infodema.webcreator.domain.enums.Roles;
import com.infodema.webcreator.domain.enums.Side;
import com.infodema.webcreator.domain.mappers.*;
import com.infodema.webcreator.domain.core.DetailIso;
import com.infodema.webcreator.domain.utility.SecurityUtils;
import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuIsoEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelIsoEntity;
import com.infodema.webcreator.persistance.repositories.*;
import com.infodema.webcreator.domain.projections.MainProjection;
import com.infodema.webcreator.persistance.entities.security.User;
import com.infodema.webcreator.persistance.repositories.security.RoleRepository;
import com.infodema.webcreator.persistance.repositories.security.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MainService {

    private final RoleRepository roleRepository;
    private final MainRepository mainRepository;
    private final MenuRepository menuRepository;
    private final DetailRepository detailRepository;
    private final ItemRepository itemRepository;
    private final PanelRepository panelRepository;
    private final MainMapper mainMapper;
    private final AuditorAware<User> auditorAware;
    private final DetailsService detailsService;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;
    private final MainWithoutChildrenMapper mainWithoutChildrenMapper;
    private final PanelMapper panelMapper;
    private final MenuMapper menuMapper;

    @Transactional(readOnly = true)
    public Page<MainProjection> findMains(MainCriteria criteria, Pageable pageable) {
        return mainRepository.findMainsByCriteria(criteria, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Main> findCustomers(String host, Pageable mainPageable) {

        String role = String.join(",", SecurityUtils.getUserRoles());

        if (role.equals(Roles.ADMIN.name())) {
            Page<Main> allEntities =  mainWithoutChildrenMapper.toDomain(mainRepository.findAll(mainPageable));
            allEntities.getContent().forEach(main -> {
                main.setCustomers(customerMapper.toDomain(userRepository.findByHost(main.getHost())).stream().filter(a-> !a.getRole().equals(Roles.ADMIN.name())).toList());
            });
            return allEntities;
        }

        if (role.equals(Roles.MANAGER.name())) {
            Main main = mainWithoutChildrenMapper.toDomain(mainRepository.findByHost(host).orElseThrow());
            main.setCustomers(customerMapper.toDomain(userRepository.findByHost(host)).stream().filter(a-> a.getRole().equals(Roles.USER.name())).toList());
            return new PageImpl<>(Collections.singletonList(main));
        }

        return null;
    }

    @Transactional(readOnly = true)
    public Page<Main> findDomains(Pageable mainPageable) {
        return mainWithoutChildrenMapper.toDomain(mainRepository.findAll(mainPageable));
    }

    @Transactional
    public void deleteMain(Long id, String host) {
        userRepository.deleteByHost(host);

        MainEntity mainEntity = mainRepository.findById(id).orElseThrow(EntityNotFoundException::new);

        mainEntity.getMenus().forEach(menuEntity -> {
            List<DetailEntity> detailList = detailRepository.findByMenu_Id(menuEntity.getId());
            detailList.forEach(detailEntity -> {
                itemRepository.deleteByDetail_Id(detailEntity.getId());
            });
            detailRepository.deleteByMenu_Id(menuEntity.getId());
            panelRepository.deleteByMenu_Id(menuEntity.getId());
        });
        menuRepository.deleteByMain_Id(id);
        mainRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Main findById(Long id) {
        return mainMapper.toDomain(mainRepository.findById(id).orElseThrow(() -> new RuntimeException("Main was not found with id [" + id + "]")));
    }

    @Transactional
    public void saveMain(Main main, MultipartFile file, MultipartFile fileBg) {
        main.setOwner(auditorAware.getCurrentAuditor().orElseThrow());

        MainEntity entity = mainMapper.toEntity(main);


        if (main.getRemovePicture() != null && main.getRemovePicture() == Boolean.TRUE) {
            entity.setImage(null);
        } else {
            if (file != null) {
                entity.setImage(file);
            } else {
                if (main.getId() != null) {
                    mainRepository.findById(main.getId()).ifPresent(current -> {
                        entity.setFileName(current.getFileName());
                        entity.setMimeType(current.getMimeType());
                        entity.setSize(current.getSize());
                        entity.setContent(current.getContent());
                    });
                }
            }
        }


        if (main.getRemovePictureBackground() != null && main.getRemovePictureBackground() == Boolean.TRUE) {
            entity.setImageBackground(null);
        } else {
            if (fileBg != null) {
                entity.setImageBackground(fileBg);
            } else {
                if (main.getId() != null) {
                    mainRepository.findById(main.getId()).ifPresent(current -> {
                        entity.setFileNameBackground(current.getFileNameBackground());
                        entity.setMimeTypeBackground(current.getMimeTypeBackground());
                        entity.setSizeBackground(current.getSizeBackground());
                        entity.setContentBackground(current.getContentBackground());
                    });
                }
            }
        }


        MainEntity mainEntity = mainRepository.save(entity);
        if (main.getId() == null) {
           Set<MenuIsoEntity> menuIso = new HashSet<>();
            menuIso.add(
                    MenuIsoEntity.builder()
                            .iso(Country.fromCode("GB-eng"))
                            .title("title")
                            .description("description")
                            .build()
            );

            Set<PanelIsoEntity> menuPanelIso = new HashSet<>();
            menuPanelIso.add(
                    PanelIsoEntity.builder()
                            .iso(Country.fromCode("GB-eng"))
                            .title("Side title")
                            .description("Side description")
                            .build()
            );

            MenuEntity menuEntity = menuRepository.save(
                    MenuEntity.builder()
                            .iso(menuIso)
                            .icon("favorite")
                            .orderNum(1)
                            .side(Side.RIGHT)
                            .layout(Layout.FULL)
                            .hideMenuPanelIfOne(false)
                            .panelOn(false)
                            .main(mainEntity)
                            .build()
            );

            PanelEntity panelEntity = panelRepository.save(
                    PanelEntity.builder()
                            .iso(menuPanelIso)
                            .menu(menuEntity)
                            .orderNum(1)
                            .build()
            );

            detailsService.addDetail(
                    menuEntity.getId(),
                    panelEntity.getId(),
                    Detail.builder()
                            .columns(1)
                            .backgroundColor("")
                            .show(true)
                            .iso(
                                    Collections.singleton(DetailIso.builder()
                                    .iso("GB-eng")
                                    .label("Test")
                                    .title("Test title")
                                    .build())
                            )
                            .build()
            );
        }

    }

    @Transactional(readOnly = true)
    public Header findHeaderByHost(String host) {
        MainEntity entity = mainRepository.findByHost(host).isPresent() ? mainRepository.findByHost(host).get() : null;
        if (entity == null) {
            return Header.builder().colors(Colors.builder().primaryColor("green").secondaryColor("white").build()).build();
        }

        List<MenuEntity> menus = entity.getMenus();
      //  List<MenuPanelItem> menuPanelItem =  panelMapper.toDomain(details.ge)).collect(Collectors.toList());
        return Header.builder()
                .main(mainWithoutChildrenMapper.toDomain(entity))
                .iso(mainMapper.toDomainMainIso(entity.getIso()))
                .languages(
                        entity.getIso().stream()
                                .map(a->a.getIso().getCountryCode())
                                .collect(Collectors.toList())
                )
                .menus(
                        menus.stream()
                                .sorted(Comparator.comparing(MenuEntity::getOrderNum))
                                .map(menu -> Menu.builder()
                                        .iso(menuMapper.toDomainMenuIso(menu.getIso()))
                                        .menuUrl(menu.getMenuUrl())
                                        .side(menu.getSide())
                                        .layout(menu.getLayout())
                                        .panelOn(menu.getPanelOn())
                                        .searchOn(menu.getSearchOn())
                                        .hideMenuPanelIfOne(menu.getHideMenuPanelIfOne())
                                        .mainId(menu.getMain().getId())
                                        .orderNum(menu.getOrderNum())
                                        .panels(panelMapper.toDomain(menu.getPanels()).stream().sorted(Comparator.comparing(Panel::getOrderNum)).toList())
                                        .icon(menu.getIcon())
                                        .build()
                                )
                                .collect(Collectors.toList())
                )
                .activeTopMenuUrl(menus.stream().min(Comparator.comparing(MenuEntity::getOrderNum)).orElseThrow().getMenuUrl())
                .activeSideMenuUrl(menus.stream().min(Comparator.comparing(MenuEntity::getOrderNum)).orElseThrow().getPanels().stream().min(Comparator.comparing(PanelEntity::getOrderNum)).orElseThrow().getPanelUrl())
//                .linearPercentage(entity.getLinearPercentage() != null ? entity.getLinearPercentage() : 0)
//                .host(entity.getHost())
                .colors(Colors.builder()
                        .primaryColor(entity.getPrimaryColor())
                        .secondaryColor(entity.getSecondaryColor())
                        .primaryColorLight(entity.getPrimaryColorLight())
                        .secondaryColorLight(entity.getSecondaryColorLight())
                        .warnColor(entity.getWarnColor())
                        .warnColorLight(entity.getWarnColorLight())
                        .infoColor(entity.getInfoColor())
                        .infoColorLight(entity.getInfoColorLight())
                        .acceptColor(entity.getAcceptColor())
                        .acceptColorLight(entity.getAcceptColorLight())
                        .dangerColor(entity.getDangerColor())
                        .dangerColorLight(entity.getDangerColorLight())
                        .build())
//                .backgroundImage(entity.getContentBackground())
//                .iconImage(entity.getContent())
                .build();
    }

    @Transactional
    public void updateUserRole(Long userId, String roleToSet) {
        log.info("Updating Users {} Role {}", userId, roleToSet);

        var role = roleRepository.findByName(roleToSet).orElseThrow(() -> new EntityNotFoundException("No role found with Name:" + roleToSet));
        var user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("No user found with ID:" + userId));

        user.getRoles().clear();
        user.getRoles().add(role);

        userRepository.save(user);
    }


}
