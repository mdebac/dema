package com.infodema.webcreator.persistance.entities.panel;

import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;

@SuperBuilder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "panel")
public class PanelEntity extends BaseAuditEntity {

    private String icon;
    private String panelUrl;
    private Integer orderNum;
    private String imageFileName;
    private String imageMimeType;
    private long imageSize;
    @Column(name = "image_content", columnDefinition="MEDIUMBLOB")
    private byte[] imageContent;

    @ManyToOne
    @JoinColumn(name = "menu_id", nullable = false)
    private MenuEntity menu;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "panel_iso",
            joinColumns = @JoinColumn(name = "panel_id", nullable = false)
    )
    @Builder.Default
    private Set<PanelIsoEntity> iso = new HashSet<>();


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
