package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.DetailIso;
import com.infodema.webcreator.domain.core.Main;
import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.detail.DetailIsoEntity;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.domain.core.MainIso;
import com.infodema.webcreator.persistance.entities.main.MainIsoEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class MainMapper extends AbstractMapper {

    private final DetailMapper detailMapper;
    private final MenuMapper menuMapper;

    public Set<MainIso> toDomainMainIso(Set<MainIsoEntity> entities) {
        return convertCollection(entities, this::toDomainMainIso);
    }

    public Set<MainIsoEntity> toEntityMainIso(Set<MainIso> entities) {
        return convertCollection(entities, this::toEntityMainIso);
    }

 /*
   public Map<Country,MainIsoEntity> toEntityMainIso(Set<MainIso> entities) {
        return entities.stream()
                .collect(
                        Collectors
                                .toMap( country -> Country.fromCode(country.getIso()), this::toEntityMainIso));
    }
    public Set<MainIso> toDomainMainIso(Map<Country,MainIsoEntity> mainIsoEntityMap) {
        return mainIsoEntityMap.values().stream().map(this::toDomainMainIso).collect(Collectors.toSet());
    }
  */

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
                .host(entity.getHost())
                .price(entity.getPrice())
              //  .usedCountries(Arrays.stream(entity.getLanguages().split(",")).toList())
          //        .comments(ApartmentCommentMapper.toDomain(entity.getComments()))
                .menus(menuMapper.toDomain(entity.getMenus()))
                .iso(toDomainMainIso(entity.getIso()))
                .build();
    }

    public MainEntity toEntity(Main main) {
        return MainEntity.builder()
                .id(main.getId())
                .host(main.getHost())
                .price(main.getPrice())
                .primaryColor(main.getPrimaryColor())
                .secondaryColor(main.getSecondaryColor())
                .primaryColorLight(main.getPrimaryColorLight())
                .secondaryColorLight(main.getSecondaryColorLight())
                .warnColor(main.getWarnColor())
                .warnColorLight(main.getWarnColorLight())
                .infoColor(main.getInfoColor())
                .infoColorLight(main.getInfoColorLight())
                .acceptColor(main.getAcceptColor())
                .acceptColorLight(main.getAcceptColorLight())
                .dangerColor(main.getDangerColor())
                .dangerColorLight(main.getDangerColorLight())
                .owner(main.getOwner())
                .iso(toEntityMainIso(main.getIso()))
                .createdOn(main.getCreatedOn())
                .createdBy(main.getCreatedBy())
                .modifiedOn(main.getModifiedOn())
                .modifiedBy(main.getModifiedBy())
               // .details(detailMapper.toEntity(main.getDetails()))
                .build();
    }


    private MainIso toDomainMainIso(MainIsoEntity entity) {
        return MainIso.builder()
                .iso(entity.getIso().getCountryCode())
                .description(entity.getDescription())
                .iconText(entity.getIconText())
                .title(entity.getTitle())
                .build();
    }


    private MainIsoEntity toEntityMainIso(MainIso domain) {
        return MainIsoEntity.builder()
                .iso(Country.fromCode(domain.getIso()))
                .description(domain.getDescription())
                .iconText(domain.getIconText())
                .title(domain.getTitle())
                .build();
    }



}
