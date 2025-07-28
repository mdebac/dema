package com.infodema.webcreator.persistance.entities.main;

import com.infodema.webcreator.persistance.entities.BaseAuditEntity;
import com.infodema.webcreator.persistance.entities.detail.DetailEntity;
import com.infodema.webcreator.persistance.entities.security.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.apache.commons.io.IOUtils;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Column(unique=true)
    private String host;

    @SneakyThrows
    public void setImage(MultipartFile multipartFile){
        if(multipartFile != null){
            setFileName(multipartFile.getOriginalFilename());
            setMimeType(multipartFile.getContentType());
            setSize(multipartFile.getSize());
            setContent(IOUtils.toByteArray(multipartFile.getInputStream()) );
        }
    }

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
    private List<DetailEntity>  details;

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
