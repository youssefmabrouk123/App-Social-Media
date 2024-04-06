package com.twd.SpringSecurityJWT.controller;

import com.twd.SpringSecurityJWT.entity.Interaction;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.service.InteractionService;
import com.twd.SpringSecurityJWT.service.PostService;
import com.twd.SpringSecurityJWT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users/interaction")
public class InteractionController {

    @Autowired
    private InteractionService interactionService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @PostMapping("/add/{postId}")
    public ResponseEntity<String> addInteraction(@PathVariable Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

        Post post = postService.getPostById(postId);
        if (post == null) {
            return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
        }

        interactionService.addInteraction(post, user);

        return new ResponseEntity<>("Interaction added successfully", HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Interaction>> getAllInteractionsByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Interaction> interactions = interactionService.getInteractionsByUserId(user.getId());

        // Print interactions in console
        System.out.println("Interactions for user " + user.getUsername() + ":");
        for (Interaction interaction : interactions) {
            System.out.println(interaction.toString());
        }

        return ResponseEntity.ok(interactions); // Return interactions as JSON response with HTTP status 200 (OK)
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<String> deleteInteraction(@PathVariable Long postId) {
        // Get the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

        // Delete the interaction
        boolean deleted = interactionService.deleteInteractionByPostIdAndUserId(postId, user.getId());

        if (deleted) {
            return new ResponseEntity<>("Interaction deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Interaction not found for the specified post ID", HttpStatus.NOT_FOUND);
        }
    }
}
