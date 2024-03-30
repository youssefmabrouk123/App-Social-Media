// PublicationService.java

package com.twd.SpringSecurityJWT.service;

import com.twd.SpringSecurityJWT.entity.Publication;
import com.twd.SpringSecurityJWT.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PublicationService {

    @Autowired
    private PublicationRepository publicationRepository;

    public Publication publishPublication(Publication publication) {
        // Add any additional logic before saving if needed
        return publicationRepository.save(publication);
    }

    public void deletePublication(Long id) {
        publicationRepository.deleteById(id);
    }

    public Publication updatePublication(Long id, Publication updatedPublication) {
        // Retrieve the existing publication
        Publication existingPublication = publicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Publication not found"));

        // Update the existing publication with the new data
        existingPublication.setContent(updatedPublication.getContent());
        // Update other fields if needed

        // Save and return the updated publication
        return publicationRepository.save(existingPublication);
    }

    public Optional<Publication> getPublicationById(Long id) {
        return publicationRepository.findById(id);
    }
}
