package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.domain.core.MainCriteria;
import com.infodema.webcreator.domain.projections.MainProjection;
import com.infodema.webcreator.persistance.entities.item.ItemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {
    void deleteByDetail_Id(Long detailId);
  //  Optional<ItemEntity> findByDetail_IdOrderByOrderNumAsc(Long detailId);

    @Query(
            value =
                    """
                              select
                                  MAX(a.order_num) as OrderNum
                              from item a
                              where (a.detail_id = :#{#detailId})
                    """,
            nativeQuery = true)
    Integer findMaxOrderNum(Long detailId);

}
