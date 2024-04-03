package com.twd.SpringSecurityJWT.service;

import com.twd.SpringSecurityJWT.entity.Interaction;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

}
