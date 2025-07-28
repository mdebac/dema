package com.infodema.webcreator.services;

import com.infodema.webcreator.domain.core.Colors;
import com.infodema.webcreator.domain.core.Detail;
import com.infodema.webcreator.domain.core.Header;
import com.infodema.webcreator.domain.core.HeaderDetail;
import com.infodema.webcreator.domain.mappers.DetailMapper;
import com.infodema.webcreator.domain.mappers.MainMapper;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.persistance.repositories.DetailRepository;
import com.infodema.webcreator.persistance.repositories.ItemRepository;
import com.infodema.webcreator.persistance.repositories.MainRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class DetailsService {
    private static final String NOT_FOUND = "Details was not found";

    private final MainRepository mainRepository;
    private final ItemRepository itemRepository;
    private final DetailRepository detailRepository;
    private final MainMapper mainMapper;
    private final DetailMapper detailMapper;


    @Transactional
    public Detail addToMain(Long mainId, Detail payload) {
        log.info("Adding Detail to Main {}", mainId);

        MainEntity mainEntity = mainRepository.findById(mainId)
                .orElseThrow(() -> new EntityNotFoundException("No Main found with ID:: " + mainId));

        DetailEntity detailEntity = detailMapper.toEntity(payload);
        detailEntity.setMain(mainEntity);

        detailRepository.save(detailEntity);
        return detailMapper.toDomain(detailEntity);
    }

    @Transactional
    public void removeFromMain(Long mainId, Long id) {
        log.info("Removing detail {} from Main {}", id, mainId);

        if(detailRepository.countByMain_Id(mainId) == 1){
                throw new RuntimeException("Cant delete, Min one");
        }

        itemRepository.deleteByDetail_Id(id);
        detailRepository.deleteById(id);
    }

    @Transactional
    public Detail updateInMain(Long mainId, Long id, Detail payload) {
        log.info("Updating Detail {} from Main {}", id, mainId);

        DetailEntity entity = detailRepository.findById(id).orElseThrow(() -> {
            log.warn("Detail {} was not found for updating in Main {}", id, mainId);
            return new RuntimeException(NOT_FOUND);
        });
        if (!entity.getMain().getId().equals(mainId)) {
            log.warn("Detail {} does not belong to Main {}", id, mainId);
            throw new RuntimeException("Detail does not belong to Main");
        }

        detailMapper.updateEntityByModel(entity, payload);
        return detailMapper.toDomain(detailRepository.save(entity));
    }


    public void deleteAll(Long mainId) {
        log.info("Deleting all details from Main id {}", mainId);
        detailRepository.deleteByMain_Id(mainId);
    }

    public Detail findDetailByUrlLabels(String host, String detailLabel) {

        MainEntity entity = mainRepository.findByHost(host)
                .orElseThrow(() -> new RuntimeException("Main was not found with label [" + host + "]"));

        if (detailLabel == null || detailLabel.isEmpty()) {
            return detailMapper.toDomain(
                    detailRepository.findByMainIdOrderByMainAsc(entity.getId()).stream().findFirst().orElseThrow(() -> new RuntimeException("first Detail was not found with host [" + host + "] an detailLabel [" + detailLabel + "]")));
        } else {
            return detailMapper.toDomain(
                    detailRepository.findByTitleUrlAndMainId(detailLabel, entity.getId()).orElseThrow(() -> new RuntimeException("Detail was not found with host [" + host + "] an detailLabel [" + detailLabel + "]")));
        }

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
                .apartmentUrl(entity.getHost())
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

    public Detail findDetailByDetailId(Long detailId) {
        return detailMapper.toDomain(detailRepository.findById(detailId).orElseThrow(() -> new RuntimeException("Detail was not found with detailId [" + detailId + "]")));
    }

    public List<Detail> findDetailByMainId(Long mainId) {
        return detailMapper.toDomain(
                detailRepository.findByMainIdOrderByMainAsc(mainId).stream().toList());

    }

}


