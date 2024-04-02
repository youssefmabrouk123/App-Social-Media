package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findByUserId(Long userId);
}
