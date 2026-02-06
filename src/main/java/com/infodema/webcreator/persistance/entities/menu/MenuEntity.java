package com.infodema.webcreator.persistance.entities.menu;

import com.infodema.webcreator.domain.core.ProductType;
import com.infodema.webcreator.domain.enums.Layout;
import com.infodema.webcreator.domain.enums.Side;
import com.infodema.webcreator.domain.enums.TopMenuType;
import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.entities.main.ProductEntity;
import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.apache.commons.io.IOUtils;
import org.hibernate.type.TrueFalseConverter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "menu")
public class MenuEntity extends BaseAuditEntity {

    private String icon;
    private String menuUrl;
    private Integer orderNum;
    private String imageFileName;
    private String imageMimeType;
    private long imageSize;
    private BigDecimal price;

    @Column(name = "image_content", columnDefinition="MEDIUMBLOB")
    private byte[] imageContent;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Side side;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Layout layout;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TopMenuType topMenuType;

    @Convert(converter = TrueFalseConverter.class)
    private Boolean hideMenuPanelIfOne;

    @Convert(converter = TrueFalseConverter.class)
    private Boolean panelOn;

    @Convert(converter = TrueFalseConverter.class)
    private Boolean searchOn;

    @ManyToOne
    @JoinColumn(name = "main_id", nullable = false)
    private MainEntity main;

    @OneToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private ProductEntity product;

    @OrderBy("orderNum ASC")
    @OneToMany(mappedBy = "menu")
    private List<PanelEntity> panels;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "menu_iso",
            joinColumns = @JoinColumn(name = "menu_id", nullable = false)
    )
    @Builder.Default
    private Set<MenuIsoEntity> iso = new HashSet<>();


    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "menu_properties",
            joinColumns = @JoinColumn(name = "menu_id", nullable = false)
    )
    @Builder.Default
    private Set<MenuPropertyEntity> menuProperties = new HashSet<>();

    @SneakyThrows
    public void setImage(MultipartFile multipartFile){
        if(multipartFile != null){
            setImageFileName(multipartFile.getOriginalFilename());
            setImageMimeType(multipartFile.getContentType());
            setImageSize(multipartFile.getSize());
            setImageContent(IOUtils.toByteArray(multipartFile.getInputStream()) );
        }else{
            setImageContent(null);
            setImageSize(0);
            setImageMimeType(null);
            setImageFileName(null);
        }
    }

}
