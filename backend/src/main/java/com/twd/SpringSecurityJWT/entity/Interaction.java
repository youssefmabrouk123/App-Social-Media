package com.twd.SpringSecurityJWT.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "interaction")
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime creationDate;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private OurUsers user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    // Constructors, getters, and setters
    @Override
    public String toString() {
        return "Interaction{" +
                "id=" + id +
                ", creationDate=" + creationDate +
                ", user=" + (user != null ? user.getId() : null) +
                ", post=" + (post != null ? post.getId() : null) +
                '}';
    }
}
