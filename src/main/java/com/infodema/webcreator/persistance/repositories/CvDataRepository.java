package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.CvDataEntity;
import com.infodema.webcreator.domain.cv.CvDataProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CvDataRepository extends JpaRepository<CvDataEntity, Long> {

    @Query(
            value =
                    """
                                    select
                                        cv.id as Id,
                                        cv.name as Name,
                                        cv.email as Email,
                                        cv.cover_letter_text as CoverLetterText,
                                        cv.file_name as FileName,
                                        cv.mime_type as MimeType,
                                        cv.created_on as CreatedOn
                                   from cv_data cv
                             """,
            countQuery =
                    """
                            select count(1) from cv_data
                    """,
            nativeQuery = true)
    Page<CvDataProjection> allCvData(Pageable pageable);

    Optional<CvDataEntity> findByEmailAndItemId(String email, Long itemId);
}