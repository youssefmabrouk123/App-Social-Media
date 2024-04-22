package com.twd.SpringSecurityJWT.repository;

import com.twd.SpringSecurityJWT.entity.Interaction;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findByUserId(Long userId);
    List<Interaction> findByUser(OurUsers user);
    void deleteByUser(OurUsers user);
    @Transactional
    int deleteByPostIdAndUserId(Long postId, Long userId);

    @Transactional
    void deleteByPostId(Long postId);


    List<Interaction> findByPostId(Long postId);

}
