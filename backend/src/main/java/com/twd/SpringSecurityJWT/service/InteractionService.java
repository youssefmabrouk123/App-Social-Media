package com.twd.SpringSecurityJWT.service;

import com.twd.SpringSecurityJWT.entity.Interaction;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InteractionService {

    @Autowired
    private InteractionRepository interactionRepository;

    public void addInteraction(Post post, OurUsers user) {
        Interaction interaction = new Interaction();
        interaction.setCreationDate(LocalDateTime.now());
        interaction.setUser(user);
        interaction.setPost(post);
        interactionRepository.save(interaction);
    }
    public List<Interaction> getInteractionsByUserId(Long userId) {
        return interactionRepository.findByUserId(userId);
    }

    @Transactional
    public boolean deleteInteractionByPostIdAndUserId(Long postId, Long userId) {
        int deletedRecords = interactionRepository.deleteByPostIdAndUserId(postId, userId);
        return deletedRecords > 0;
    }

    public void deleteInteractionsByPostId(Long postId) {
        interactionRepository.deleteByPostId(postId);
    }

    public List<Interaction> getInteractionsByPostId(Long postId) {
        return interactionRepository.findByPostId(postId);
    }


}
