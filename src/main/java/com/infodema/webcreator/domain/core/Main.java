package com.infodema.webcreator.domain.core;


import com.infodema.webcreator.domain.mappers.AbstractAuditModel;
import com.infodema.webcreator.persistance.entities.security.User;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Page;

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
    private byte[] image;
    private List<Comment> comments;
    private List<Detail>  details;
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
    private Boolean removePicture;
    private List<Customer> customers;
}
