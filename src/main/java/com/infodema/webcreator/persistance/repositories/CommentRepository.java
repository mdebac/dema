package com.infodema.webcreator.persistance.repositories;

import com.infodema.webcreator.persistance.entities.main.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
}