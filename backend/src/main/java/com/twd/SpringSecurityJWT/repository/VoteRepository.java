package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
}
