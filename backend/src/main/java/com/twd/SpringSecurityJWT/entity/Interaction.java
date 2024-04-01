package com.twd.SpringSecurityJWT.entity;

import jakarta.persistence.*;
import org.apache.catalina.User;

import java.time.LocalDateTime;

@Entity
@Table(name = "interaction")
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime creationdate;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private OurUsers user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;



    // Constructors, getters, setters
}
