package com.twd.SpringSecurityJWT.service;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.entity.SavedPost;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import com.twd.SpringSecurityJWT.repository.PostRepository;
import com.twd.SpringSecurityJWT.repository.SavedPostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class SavedPostService {
    @Autowired
    private  PostRepository postRepository;
    @Autowired
    private  OurUserRepo userRepository;
    @Autowired
    private  SavedPostRepository savedPostRepository;



    public void savePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        OurUsers user = userRepository.findByEmail(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        SavedPost savedPost = new SavedPost();
        savedPost.setPost(post);
        savedPost.setUser(user);
        savedPost.setCreationdate(LocalDateTime.now());

        savedPostRepository.save(savedPost);
//
//        user.getSavedPosts().add(savedPost);
//        post.getSavedByUsers().add(savedPost);
    }

    public void unsavePost(Long postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        OurUsers user = userRepository.findByEmail(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        SavedPost savedPost = savedPostRepository.findByPostAndUser(post, user)
                .orElseThrow(() -> new EntityNotFoundException("Saved post not found"));

        savedPostRepository.delete(savedPost);

//        user.getSavedPosts().remove(savedPost);
//        post.getSavedByUsers().remove(savedPost);
    }

    public List<SavedPost> getSavedPostsByUsername(String username) {
        OurUsers user = userRepository.findByEmail(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return savedPostRepository.findByUser(user);
    }

    public void deleteSavedPostByPostId(Long postId) {
        savedPostRepository.deleteByPostId(postId);
    }
}