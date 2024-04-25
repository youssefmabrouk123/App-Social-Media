package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.Event;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepo extends JpaRepository<Participation, Long> {
    // Define any additional methods here if needed
    Participation findByEventAndUser(Event event, OurUsers user);
    boolean existsByEventAndUser(Event event, OurUsers user);
    List<Participation> findByEventId(Long eventId);

    void deleteByEventId(Long eventId);

    @Query("SELECT p FROM Participation p WHERE p.user.id = :userId AND p.event.id = :eventId")
    Optional<Participation> findByUserAndEventId(@Param("userId") Long userId, @Param("eventId") Long eventId);

}