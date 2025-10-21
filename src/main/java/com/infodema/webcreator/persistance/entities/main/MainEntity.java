package com.infodema.webcreator.persistance.entities.main;

import com.infodema.webcreator.domain.enums.Country;
import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import com.infodema.webcreator.persistance.entities.security.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.SneakyThrows;
import lombok.Builder;
import lombok.experimental.SuperBuilder;
import org.apache.commons.io.IOUtils;
import org.hibernate.type.TrueFalseConverter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Table(name = "main")
public class MainEntity extends BaseAuditEntity {

    private BigDecimal price;

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
    private Integer linearPercentage;

    @Convert(converter = TrueFalseConverter.class)
    private Boolean removePicture;

    @Convert(converter = TrueFalseConverter.class)
    private Boolean removeBackground;

    @Column(unique=true)
    private String host;

    @SneakyThrows
    public void setImage(MultipartFile multipartFile){
        if(multipartFile != null){
            setFileName(multipartFile.getOriginalFilename());
            setMimeType(multipartFile.getContentType());
            setSize(multipartFile.getSize());
            setContent(IOUtils.toByteArray(multipartFile.getInputStream()) );
        }else{
            setContent(null);
            setSize(0);
            setMimeType(null);
            setFileName(null);
        }
    }

    @SneakyThrows
    public void setImageBackground(MultipartFile multipartFile){
        if(multipartFile != null){
            setFileNameBackground(multipartFile.getOriginalFilename());
            setMimeTypeBackground(multipartFile.getContentType());
            setSizeBackground(multipartFile.getSize());
            setContentBackground(IOUtils.toByteArray(multipartFile.getInputStream()) );
        }else{
            setContentBackground(null);
            setSizeBackground(0);
            setMimeTypeBackground(null);
            setFileNameBackground(null);
        }
    }


    private String fileNameBackground;
    private String mimeTypeBackground;
    private long sizeBackground;
    @Column(name = "content_background", columnDefinition="MEDIUMBLOB")
    private byte[] contentBackground;

    private String fileName;
    private String mimeType;
    private long size;

    @Column(name = "content", columnDefinition="MEDIUMBLOB")
    private byte[] content;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

   @OneToMany(mappedBy = "main")
   //@Fetch(FetchMode.SUBSELECT)
   private List<CommentEntity> comments;

    @OneToMany(mappedBy = "main")
   // @Fetch(FetchMode.SUBSELECT)
    private List<MenuEntity>  menus;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
            name = "main_iso",
            joinColumns = @JoinColumn(name = "main_id", nullable = false)
    )
    @Builder.Default
    private Set<MainIsoEntity> iso = new HashSet<>();

    @Transient
    public double getRate() {
        if (comments == null || comments.isEmpty()) {
            return 0.0;
        }
        var rate = this.comments.stream()
                .mapToDouble(CommentEntity::getNote)
                .average()
                .orElse(0.0);
        double roundedRate = Math.round(rate * 10.0) / 10.0;

        // Return 4.0 if roundedRate is less than 4.5, otherwise return 4.5
        return roundedRate;
    }


}
