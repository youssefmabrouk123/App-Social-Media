package com.twd.SpringSecurityJWT.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.StringJoiner;

@Data
@Entity
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)


    private Long id;

    private String caption;

    private String location;

    private String tags;

    private String filename;

    private LocalDateTime creationdate;

    @Transient
    private byte[] imageData;
    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }
    //
    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "user_id",nullable = false)
    private OurUsers user;


    @OneToMany(mappedBy = "post")
    private List<SavedPost> savedByUsers = new ArrayList<>();

    @JsonIgnore
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


    @Override
    public String toString() {
        return new StringJoiner(", ", Post.class.getSimpleName() + "[", "]")
                .add("id=" + id)
                .add("caption='" + caption + "'")
                .add("location='" + location + "'")
                .add("tags='" + tags + "'")
                .add("filename='" + filename + "'")
                .add("creationdate=" + creationdate)
                .toString();
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
    
}
