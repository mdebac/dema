package com.infodema.webcreator.persistance.repositories.security;

import com.infodema.webcreator.persistance.entities.security.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String username);

    List<User> findByHost(String host);

    Page<User> findAll(Pageable pageable);

}
