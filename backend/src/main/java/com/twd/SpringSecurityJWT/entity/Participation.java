package com.twd.SpringSecurityJWT.entity;

import lombok.Data;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name = "participation")
public class Participation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime participationDate;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private OurUsers user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Override
    public String toString() {
        return "Interaction{" +
                "id=" + id +
                ", participationDate=" + participationDate +
                ", user=" + (user != null ? user.getId() : null) +
                ", post=" + (event != null ? event.getId() : null) +
                '}';
    }
}
