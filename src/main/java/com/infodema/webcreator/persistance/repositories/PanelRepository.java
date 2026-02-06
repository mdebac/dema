package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.panel.PanelEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PanelRepository extends JpaRepository<PanelEntity, Long> {
    Optional<PanelEntity> findById(Long id);
    void deleteByMenu_Id(Long menuId);
    long countByMenu_Id(Long menuId);
    Integer findOrderNumTop1OrderNumByMenu_Id(Long menuId);
    @Query(
            value =
                    """
                              select
                                  MAX(a.order_num) as OrderNum
                              from panel a
                              where (a.menu_id = :#{#menu_id})
                    """,
            nativeQuery = true)
    Integer findMaxOrderNum(Long menu_id);
}
