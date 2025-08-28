package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.domain.core.CustomerProjectionCriteria;
import com.infodema.webcreator.domain.core.MainCriteria;
import com.infodema.webcreator.domain.projections.CustomerProjection;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.entities.security.User;
import com.infodema.webcreator.domain.projections.MainProjection;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MainRepository extends JpaRepository<MainEntity, Long> {

    @Query(
            value =
                    """
                               select
                                   a.id as Id,
                                   a.title as Title,
                                   a.price as Price,
                                   d.label as DetailLabel,
                                   d.id as DetailId
                               from main a
                                         left join detail d on a.id=d.main_id
                               where 1=1
                                  and (:#{#criteria.title} is null or lower(a.title) like lower('%' + :#{#criteria.title} + '%'))
                                  and (:#{#criteria.userId} is null or a.owner_id = :#{#criteria.userId})
                             """,
            countQuery =
                    """
                               select count(1)
                               from main a
                                         join detail d on a.id=d.main_id
                               where 1=1
                                  and (:#{#criteria.title} is null or lower(a.title) like lower('%' + :#{#criteria.title} + '%'))
                                  and (:#{#criteria.userId} is null or a.owner_id = :#{#criteria.userId})
                            """,
            nativeQuery = true)
    Page<MainProjection> findMainsByCriteria(MainCriteria criteria, Pageable pageable);


    Page<MainEntity> findByOwner(User owner, Pageable pageable);

    Optional<MainEntity> findByHost(String host);

    Page<MainEntity> findAll(Pageable pageable);

    Optional<MainEntity> findById(Long id);

    MainEntity findById(Long id, Limit limit);
}
// and (:#{#criteria.chip} is null or lower(d.chip) like lower('%' + :#{#criteria.chip} + '%'))