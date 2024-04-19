package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OurUserRepo extends JpaRepository<OurUsers, Long> {
      Optional<OurUsers> findByEmail(String email);

       Optional<OurUsers> findById(Long id);
}
