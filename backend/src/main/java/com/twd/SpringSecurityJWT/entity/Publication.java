package com.twd.SpringSecurityJWT.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "publication")
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;


    // Other publication attributes

    @ManyToOne
    @JoinColumn(name = "user_id") // Use a different name for the foreign key column
    private OurUsers user;

    // Getters and setters

    // Constructors
}
