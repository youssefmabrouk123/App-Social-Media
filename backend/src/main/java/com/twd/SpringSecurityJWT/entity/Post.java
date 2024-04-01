package com.twd.SpringSecurityJWT.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)


    private Long id;

    private String caption;

    private String location;

    private String tags;

    private String filename;

    private LocalDateTime creationdate;



    public LocalDateTime getCreationdate() {
        return creationdate;
    }
    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private OurUsers user;

    @OneToMany(mappedBy = "post")
    private List<SavedPost> savedByUsers = new ArrayList<>();


    @OneToMany(mappedBy = "post")
    private List<Interaction> likedByUsers = new ArrayList<>();


    public void setCreationdate(LocalDateTime creationdate) {
        this.creationdate = creationdate;
    }


  

    public OurUsers getUser() {
        return user;
    }

    public void setUser(OurUsers user) {
        this.user = user;
    }

    public List<SavedPost> getSavedByUsers() {
        return savedByUsers;
    }

    public void setSavedByUsers(List<SavedPost> savedByUsers) {
        this.savedByUsers = savedByUsers;
    }

    public List<Interaction> getLikedByUsers() {
        return likedByUsers;
    }

    public void setLikedByUsers(List<Interaction> likedByUsers) {
        this.likedByUsers = likedByUsers;
    }




    // Stores the filename of the uploaded file

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    // Constructors
}
