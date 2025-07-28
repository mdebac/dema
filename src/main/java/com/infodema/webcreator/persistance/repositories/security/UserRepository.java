package com.infodema.webcreator.persistance.repositories.security;

import com.infodema.webcreator.persistance.entities.security.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String username);
}
