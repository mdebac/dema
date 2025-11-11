package com.infodema.webcreator.domain.core;

import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import com.infodema.webcreator.persistance.entities.security.User;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import lombok.ToString;
import lombok.Setter;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@ToString(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Main extends AbstractAuditModel {
    private String host;
    private User owner;
    private BigDecimal price;
    private List<Comment> comments;
    private List<Menu>  menus;
    private Set<MainIso> iso;
    private String primaryColor;
    private String secondaryColor;
    private String primaryColorLight;
    private String secondaryColorLight;
    private String dangerColor;
    private String dangerColorLight;
    private String warnColor;
    private String warnColorLight;
    private String infoColor;
    private String infoColorLight;
    private String acceptColor;
    private String acceptColorLight;
    private byte[] iconImage;
    private byte[] backgroundImage;
    private Boolean removePicture;
    private Boolean removePictureBackground;
    private Integer linearPercentage;
    private List<Customer> customers;
}
