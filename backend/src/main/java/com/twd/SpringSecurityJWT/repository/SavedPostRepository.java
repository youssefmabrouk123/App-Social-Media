package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.entity.SavedPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {
    Optional<SavedPost> findByPostAndUser(Post post, OurUsers user);
    List<SavedPost> findByUser(OurUsers user);
    void deleteByUser(OurUsers user);

    @Transactional
    void deleteByPostId(Long postId);
}
