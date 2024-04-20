package com.twd.SpringSecurityJWT.service;
import com.twd.SpringSecurityJWT.entity.Event;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.EventRepo;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class EventService {

    private static final String UPLOAD_DIR = "C:\\Users\\arway\\Desktop\\New folder (2)\\App-Social-Media\\backend\\eventImg"; // Update this with your upload directory path

    @Autowired
    private final EventRepo eventRepository;

    @Autowired
    private final OurUserRepo userRepository;

    @Autowired
    public EventService(EventRepo eventRepository, OurUserRepo userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }
    public void addEvent(Event event) {
        // Add any additional business logic or validation here
        eventRepository.save(event);
    }
    public String saveEvent(Event event, MultipartFile file) throws IOException {
        String filename = saveFile(file);
        event.setFilename(filename);
        eventRepository.save(event);
        return filename;
    }

    public String saveFile(MultipartFile file) throws IOException {
        // Ensure the upload directory exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save the file to the upload directory
        String filename = file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR, filename);
        Files.write(filePath, file.getBytes());

        return UPLOAD_DIR+"/"+filename;
    }

    public Event getEventById(Long eventid) {
        // Save the post to the database using repository methods
        return eventRepository.findById(eventid).orElse(null);}

    public boolean existsById(Long id) {
        return eventRepository.existsById(id);
    }

    public void deleteEventById(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }


}
