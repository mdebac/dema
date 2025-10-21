package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.Main;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MainCustomerMapper extends AbstractMapper {

    private final MainMapper mainMapper;

    public Page<Main> toDomain(Page<MainEntity> entities) {
        return convertPageCollection(entities, this::toDomain);
    }

    public List<Main> toDomain(List<MainEntity> entities) {
        return convertCollection(entities, this::toDomain);
    }


    public Main toDomain(MainEntity entity) {
        return Main.builder()
                .id(entity.getId())
                .createdOn(entity.getCreatedOn())
                .createdBy(entity.getCreatedBy())
                .modifiedOn(entity.getModifiedOn())
                .modifiedBy(entity.getModifiedBy())
                .primaryColor(entity.getPrimaryColor())
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
                .secondaryColor(entity.getSecondaryColor())
                .image(entity.getContent())
                .linearPercentage(entity.getLinearPercentage() != null ? entity.getLinearPercentage() : 0)
                .imageBackground(entity.getContentBackground())
                .host(entity.getHost())
                .price(entity.getPrice())
                .iso(mainMapper.toDomainMainIso(entity.getIso()))
                .build();
    }

}
