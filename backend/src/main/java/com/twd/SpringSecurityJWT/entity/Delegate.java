package com.twd.SpringSecurityJWT.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "delegate")
@PrimaryKeyJoinColumn(name = "id")
public class Delegate extends OurUsers {
    private String delegateDescription;
}