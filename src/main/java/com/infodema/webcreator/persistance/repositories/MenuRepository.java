package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.domain.core.MainCriteria;
import com.infodema.webcreator.domain.core.MenuProductCriteria;
import com.infodema.webcreator.domain.projections.MainProjection;
import com.infodema.webcreator.persistance.entities.main.MainEntity;
import com.infodema.webcreator.persistance.entities.menu.MenuEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<MenuEntity, Long> {
    Optional<MenuEntity> findById(Long id);
    Long countByMain_Id(Long mainId);
    void deleteByMain_Id(Long mainId);

    @Query(
            value =
                    """
                              select
                                  MAX(a.order_num) as OrderNum
                              from menu a
                              where (a.main_id = :#{#main_id})
                    """,
            nativeQuery = true)
    Integer findMaxOrderNum(Long main_id);



    @Query(
            value =
                    """
                               select *
                               from menu m
                               where 1=1
                                  and (m.main_id = :#{#criteria.product.mainId})
                             """,
            countQuery =
                    """
                               select count(1)
                               from menu m
                               where 1=1
                                  and (m.main_id = :#{#criteria.product.mainId})
                            """,
            nativeQuery = true)
    Page<MenuEntity> findMenuProductsByCriteria(MenuProductCriteria criteria, Pageable pageable);
}
