package com.twd.SpringSecurityJWT.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private int yesCount = 0;

    @Column(nullable = false)
    private int noCount = 0;

    @Column(nullable = false)
    private boolean decision = false;

    @Column(nullable = false)
    private LocalDateTime date;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "initiator_id", nullable = false)
    private OurUsers initiator;


    @ManyToMany
    @JoinTable(
            name = "vote_users_yes",
            joinColumns = @JoinColumn(name = "vote_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<OurUsers> usersVotedYes = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "vote_users_no",
            joinColumns = @JoinColumn(name = "vote_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<OurUsers> usersVotedNo = new ArrayList<>();



    //Constructors, getters, setters, and other methods
}
