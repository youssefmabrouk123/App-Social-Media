// PublicationController.java
package com.twd.SpringSecurityJWT.controller;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Publication;
import com.twd.SpringSecurityJWT.service.PublicationService;
import com.twd.SpringSecurityJWT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    @Autowired
    private UserService userService;

    @PostMapping("/pub/publish")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> publishPublication(@RequestBody Publication publication) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        OurUsers currentUser = userService.getUserByMail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        publication.setUser(currentUser);
        Publication createdPublication = publicationService.publishPublication(publication);
        return ResponseEntity.ok(createdPublication);
    }

    @DeleteMapping("/pub/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deletePublication(@PathVariable Long id) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Publication publication = publicationService.getPublicationById(id)
                .orElseThrow(() -> new RuntimeException("Publication not found"));
        if (!publication.getUser().getEmail().equals(userEmail)) {
            return ResponseEntity.status(403).body("You are not authorized to delete this publication");
        }
        publicationService.deletePublication(id);
        return ResponseEntity.ok("Publication deleted successfully.");
    }

    @PutMapping("/pub/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updatePublication(@PathVariable Long id, @RequestBody Publication updatedPublication) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Publication publication = publicationService.getPublicationById(id)
                .orElseThrow(() -> new RuntimeException("Publication not found"));
        if (!publication.getUser().getEmail().equals(userEmail)) {
            return ResponseEntity.status(403).body("You are not authorized to update this publication");
        }
        publication.setContent(updatedPublication.getContent());
        Publication updated = publicationService.updatePublication(id, updatedPublication);
        return ResponseEntity.ok(updated);
    }
}
