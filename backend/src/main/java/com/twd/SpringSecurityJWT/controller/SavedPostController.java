package com.twd.SpringSecurityJWT.controller;


import com.twd.SpringSecurityJWT.dto.ReqRes;
import com.twd.SpringSecurityJWT.entity.Interaction;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.entity.SavedPost;
import com.twd.SpringSecurityJWT.service.PostService;
import com.twd.SpringSecurityJWT.service.SavedPostService;
import com.twd.SpringSecurityJWT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("users/savedposts")
public class SavedPostController {

    @Autowired
    private SavedPostService savedPostService;
    @Autowired
    private UserService userService;
    @Autowired
    private PostService postService;

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

    @GetMapping("/get")
    public ResponseEntity<List<ReqRes>> getSavedPosts() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            OurUsers userCurr = userService.getUserByMail(username).orElse(null);

            if (userCurr == null) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            List<SavedPost> savedPosts = userCurr.getSavedPosts();
            List<ReqRes> postsInfo = new ArrayList<>();

            for (SavedPost savedPost : savedPosts) {
                Post post = savedPost.getPost();
                ReqRes postInfo = new ReqRes();

                postInfo.setUserId(userCurr.getId());
                postInfo.setSavedId(savedPost.getId());
                postInfo.setPostId(post.getId());
                postInfo.setLocation(post.getLocation());

                // Read image data directly from file
                Path file = Paths.get(post.getFilename());
                byte[] imageData = Files.readAllBytes(file);
                postInfo.setImageData(imageData);

                postsInfo.add(postInfo);
            }

            return new ResponseEntity<>(postsInfo, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}