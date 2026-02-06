package com.infodema.webcreator.domain.mappers;

import com.infodema.webcreator.domain.core.*;
import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.main.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class MainMapper extends AbstractMapper {

    private final MenuMapper menuMapper;
    private final ProductMapper productMapper;

    public Set<MainIso> toDomainMainIso(Set<MainIsoEntity> entities) {
        return convertCollection(entities, this::toDomainMainIso);
    }

    public Set<MainFont> toDomainMainFonts(Set<MainFontEntity> entities) {
        return convertCollection(entities, this::toDomainMainFonts);
    }

    public Set<MainLanguage> toDomainMainLanguages(Set<MainLanguageEntity> entities) {
        return convertCollection(entities, this::toDomainMainLanguages);
    }

    public Set<MainIsoEntity> toEntityMainIso(Set<MainIso> entities) {
        return convertCollection(entities, this::toEntityMainIso);
    }

    public Set<MainFontEntity> toEntityMainFont(Set<MainFont> entities) {
        return convertCollection(entities, this::toEntityMainFont);
    }

    public Set<MainLanguageEntity> toEntityMainLanguage(Set<MainLanguage> entities) {
        return convertCollection(entities, this::toEntityMainLanguage);
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
                .iconImage(entity.getContent())
                .backgroundImage(entity.getContentBackground())
                .host(entity.getHost())
                .price(entity.getPrice())
                .linearPercentage(entity.getLinearPercentage() != null ? entity.getLinearPercentage() : 0)
          //     .comments(ApartmentCommentMapper.toDomain(entity.getComments()))
                .menus(menuMapper.toDomain(entity.getMenus()))
                .products(productMapper.toDomain(entity.getProducts()))
                .iso(toDomainMainIso(entity.getIso()))
                .fonts(toDomainMainFonts(entity.getFonts()))
                .languages(toDomainMainLanguages(entity.getLanguages()))
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
                .linearPercentage(main.getLinearPercentage())
                .iso(toEntityMainIso(main.getIso()))
                .products(productMapper.toEntity(main.getProducts()))
                .fonts(toEntityMainFont(main.getFonts()))
                .languages(toEntityMainLanguage(main.getLanguages()))
                .createdOn(main.getCreatedOn())
                .createdBy(main.getCreatedBy())
                .modifiedOn(main.getModifiedOn())
                .modifiedBy(main.getModifiedBy())
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

    private MainFont toDomainMainFonts(MainFontEntity entity) {
        return MainFont.builder()
                .family(entity.getFamily())
                .build();
    }
    private MainLanguage toDomainMainLanguages(MainLanguageEntity entity) {
        return MainLanguage.builder()
                .iso(entity.getIso().getCountryCode())
                .build();
    }

    private MainFontEntity toEntityMainFont(MainFont font) {
        return MainFontEntity.builder()
                .family(font.getFamily())
                .build();
    }

    private MainLanguageEntity toEntityMainLanguage(MainLanguage language) {
        return MainLanguageEntity.builder()
                .iso(Country.fromCode(language.getIso()))
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
