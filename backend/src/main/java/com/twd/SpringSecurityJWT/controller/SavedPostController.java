package com.twd.SpringSecurityJWT.controller;


import com.twd.SpringSecurityJWT.entity.SavedPost;
import com.twd.SpringSecurityJWT.service.SavedPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users/savedposts")
public class SavedPostController {

    @Autowired
    private SavedPostService savedPostService;


    @PostMapping("/{postId}/save")
    public ResponseEntity<?> savePost(@PathVariable Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        savedPostService.savePost(postId, username);
        return ResponseEntity.ok().body("post saved successfully");
    }

    @PostMapping("/{postId}/unsave")
    public ResponseEntity<?> unsavePost(@PathVariable Long postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        savedPostService.unsavePost(postId, username);
        return ResponseEntity.ok().body("post unsaved successfully");
    }

    @GetMapping("/user")
    public ResponseEntity<List<SavedPost>> getUserSavedPosts() {
        // Extract user information from the authentication object
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Use the username to fetch user's saved posts
        List<SavedPost> savedPosts = savedPostService.getSavedPostsByUsername(username);

        return ResponseEntity.ok(savedPosts);
    }
}