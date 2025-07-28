package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.item.ItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<ItemEntity, Long> {
    void deleteByDetail_Id(Long detailId);
}