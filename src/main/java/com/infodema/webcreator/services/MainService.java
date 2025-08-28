package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.core.*;
import com.infodema.webcreator.domain.enums.Roles;
import com.infodema.webcreator.domain.mappers.CustomerMapper;
import com.infodema.webcreator.domain.mappers.DetailMapper;
import com.infodema.webcreator.domain.mappers.MainCustomerMapper;
import com.infodema.webcreator.domain.mappers.MainMapper;
import com.infodema.webcreator.domain.core.DetailIso;
import com.infodema.webcreator.domain.utility.SecurityUtils;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.repositories.DetailRepository;
import com.infodema.webcreator.persistance.repositories.MainRepository;
import com.infodema.webcreator.domain.projections.MainProjection;
import com.infodema.webcreator.persistance.entities.security.User;
import com.infodema.webcreator.persistance.repositories.security.UserRepository;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MainService {

    private final MainRepository mainRepository;
    private final DetailRepository detailRepository;
    private final MainMapper mainMapper;
    private final AuditorAware<User> auditorAware;
    private final DetailMapper detailMapper;
    private final DetailsService detailsService;
    private final UserRepository userRepository;
    private final CustomerMapper customerMapper;
    private final MainCustomerMapper mainCustomerMapper;

    public Page<MainProjection> findMains(MainCriteria criteria, Pageable pageable) {
        return mainRepository.findMainsByCriteria(criteria, pageable);
    }

    public Page<Main> findCustomers(String host, Pageable mainPageable) {

        String role = String.join(",", SecurityUtils.getUserRoles());

        if (role.equals(Roles.ADMIN.name())) {
            Page<Main> allEntities =  mainCustomerMapper.toDomain(mainRepository.findAll(mainPageable));
            allEntities.getContent().forEach(main -> {
                main.setCustomers(customerMapper.toDomain(userRepository.findByHost(main.getHost())));
            });
            return allEntities;
        }

        if (role.equals(Roles.MANAGER.name())) {
            Main main = mainCustomerMapper.toDomain(mainRepository.findByHost(host).orElseThrow());
            main.setCustomers(customerMapper.toDomain(userRepository.findByHost(host)));
            return new PageImpl<>(Collections.singletonList(main));
        }


      /*
           @PostMapping(
            value = "/search",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Page<DecisionHeaderDto> searchDecisions(@RequestBody DecisionQuery query) {
        Sort sort = query.getPageable() == null || query.getPageable().getSort().isEmpty()
                ? Sort.by(Sort.Direction.DESC, DecisionQuery.SortType.DECISION_DATE.getField())
                : Sort.by(
                        query.getPageable().getDirection(),
                        query.getPageable().getSort().stream()
                                .map(DecisionQuery.SortType::getField)
                                .toArray(String[]::new));

        return decisionService
                .search(
                        query.getCriteria(),
                        (query.getPageable() == null
                                ? Pageable.unpaged()
                                : PageRequest.of(
                                        query.getPageable().getPage(),
                                        query.getPageable().getSize(),
                                        sort)))
                .map(decisionMapperService::constructFrom);
    }
       userRepository.findCustomersByCriteria(
                CustomerProjectionCriteria.builder()
                        .role(String.join(",", SecurityUtils.getUserRoles()))
                        .host(host)
                        .build(),
                pageable);*/
        return null;
    }

    @Transactional
    public void deleteMain(Long id) {
        detailRepository.deleteByMain_Id(id);
        mainRepository.deleteById(id);
    }

    public Main findById(Long id) {
        return mainMapper.toDomain(mainRepository.findById(id).orElseThrow(() -> new RuntimeException("Main was not found with id [" + id + "]")));
    }

    @Transactional
    public Main saveMain(Main main, MultipartFile file) {
        main.setOwner(auditorAware.getCurrentAuditor().orElseThrow());

        MainEntity entity = mainMapper.toEntity(main);
        if (file != null) {

            if (main.getRemovePicture() != null && main.getRemovePicture()) {
                entity.setImage(null);
                entity.setRemovePicture(false);
            } else {
                entity.setImage(file);
            }

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
        Main savedMain = mainMapper.toDomain(mainRepository.save(entity));

        if (main.getId() == null) {
            //create default detail
            detailsService.addToMain(
                    savedMain.getId(),
                    Detail.builder()
                            .host(savedMain.getHost())
                            .mainId(savedMain.getId())
                            .icon("favorite")
                            .titleUrl("test")
                            .columns(1)
                            .show(false)
                            .iso(Collections.singleton(DetailIso.builder()
                                    .iso("GB-eng")
                                    .label("Test")
                                    .title("Test title")
                                    .build()))
                            .build()
            );
        }

        return savedMain;
    }


    public Header findHeaderByHost(String host) {

        MainEntity entity = mainRepository.findByHost(host).isPresent() ? mainRepository.findByHost(host).get() : null;

        if (entity == null) {
            return Header.builder().colors(Colors.builder().primaryColor("green").secondaryColor("white").build()).build();
        }

        List<Detail> details = detailMapper.toDomain(entity.getDetails());

        return Header.builder()
                .iso(mainMapper.toDomainMainIso(entity.getIso()))
                .languages(
                        entity.getIso().stream()
                                .map(d -> d.getIso().getCountryCode())
                                .collect(Collectors.toList())
                )
                .detail(
                        details.stream()
                                .sorted(Comparator.comparing(Detail::getId))
                                .map(detail -> HeaderDetail.builder()
                                        .iso(detail.getIso())
                                        .detailUrl(detail.getTitleUrl())
                                        .icon(detail.getIcon())
                                        .build()
                                )
                                .collect(Collectors.toList())
                )
                .activeDetailUrl(details.stream().min(Comparator.comparing(Detail::getId)).orElseThrow().getTitleUrl())
                .host(entity.getHost())
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
                .iconImage(entity.getContent()).build();
    }

    public Detail findDetailById(Long id) {
        return detailMapper.toDomain(detailRepository.findById(id).orElseThrow(() -> new RuntimeException("Detail not found")));
    }

}
