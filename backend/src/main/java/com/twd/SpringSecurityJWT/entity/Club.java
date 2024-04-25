package com.twd.SpringSecurityJWT.entity;

import lombok.Data;
import jakarta.persistence.*;


@Data
@Entity
@Table(name = "club")
@PrimaryKeyJoinColumn(name = "id")
public class Club extends OurUsers {
    private String clubDescription;
}
