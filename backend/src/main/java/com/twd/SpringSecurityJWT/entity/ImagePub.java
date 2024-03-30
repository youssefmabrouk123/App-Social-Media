package com.twd.SpringSecurityJWT.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ImagePub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Other image attributes

    @OneToOne
    @JoinColumn(name = "publication_id")
    private Publication publication;

    // Getters and setters
}
