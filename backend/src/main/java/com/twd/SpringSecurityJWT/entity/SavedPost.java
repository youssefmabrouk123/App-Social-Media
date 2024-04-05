package com.twd.SpringSecurityJWT.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "saved_post")
public class SavedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime creationdate;

    //@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private OurUsers user;

    //@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Post post;

    // Constructors, getters, setters
    @Override
    public String toString() {
        return "SavedPost{" +
                "id=" + id +
                ", creationdate=" + creationdate +
                ", user=" + (user != null ? user.getId() : null) +
                ", post=" + (post != null ? post.getId() : null) +
                '}';
    }
}