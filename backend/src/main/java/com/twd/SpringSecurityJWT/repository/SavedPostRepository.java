package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.SavedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {
    List<SavedPost> findByUserId(Long userId);
}
