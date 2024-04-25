package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {


}
