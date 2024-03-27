package com.ednet.last_dance.repository;

import com.ednet.last_dance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
    boolean existsByUsername(String username);
    boolean existsByMail(String Mail);

}
