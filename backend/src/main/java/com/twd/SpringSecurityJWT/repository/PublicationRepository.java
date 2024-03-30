package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    // You can add custom query methods if needed
}
