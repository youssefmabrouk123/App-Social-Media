package com.twd.SpringSecurityJWT.repository;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Additional custom query methods can be defined here if needed
    void deleteByUser(OurUsers user);


}
