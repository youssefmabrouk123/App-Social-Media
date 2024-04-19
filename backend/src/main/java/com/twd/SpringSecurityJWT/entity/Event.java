package com.twd.SpringSecurityJWT.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;

@Data
@Entity
@Table(name = "event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String eventName;
    private String eventDescription;
    private String eventDate;
    private LocalDateTime creationDate;
    private String location;
    private String organizer;
    private String filename;

    // Other event details

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private OurUsers user;

    @JsonIgnore
    @OneToMany(mappedBy = "event")
    private List<Participation> participation = new ArrayList<>();

    @Override
    public String toString() {
        return new StringJoiner(", ", Post.class.getSimpleName() + "[", "]")
                .add("id=" + id)
                .add("eventName='" + eventName + "'")
                .add("eventDescription='" + eventDescription + "'")
                .add("location='" + location + "'")
                .add("eventDate='" + eventDate + "'")
                .add("organizer='" + organizer + "'")
                .add("creationDate='" + creationDate + "'")
                .add("filename='" + filename + "'")
                .toString();
    }

    @Transient
    private byte[] imageData;
    public byte[] getImageData() {
        return imageData;
    }
    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }


    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public void setEventName(String eventName) { this.eventName = eventName ;
    }

    public OurUsers getUser() {
        return user;
    }

    public void setUser(OurUsers user) {
        this.user = user;
    }


}
