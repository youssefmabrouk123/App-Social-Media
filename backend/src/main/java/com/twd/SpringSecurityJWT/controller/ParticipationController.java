package com.twd.SpringSecurityJWT.controller;

import com.twd.SpringSecurityJWT.service.EventService;
import com.twd.SpringSecurityJWT.service.ParticipationService;
import com.twd.SpringSecurityJWT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import com.twd.SpringSecurityJWT.entity.Event;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Participation;
import com.twd.SpringSecurityJWT.repository.EventRepo;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import com.twd.SpringSecurityJWT.repository.ParticipationRepo;


import java.util.Optional;

@RestController
@RequestMapping("/users/participation")
public class ParticipationController {

    @Autowired
    private OurUserRepo usersRepository;

    @Autowired
    private EventRepo eventRepository;

    @Autowired
    private ParticipationRepo participationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EventService eventService ;

    @Autowired
    private ParticipationService participationService ;


    @PostMapping("/add/{eventId}")
    public ResponseEntity<String> addParticipation(@PathVariable Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return new ResponseEntity<>("Event not found", HttpStatus.NOT_FOUND);
        }

        // Check if a participation already exists for the given user and event
        if (participationService.existsByEventAndUser(event, user)) {
            return new ResponseEntity<>("Participation already exists", HttpStatus.CONFLICT);
        }

        // If participation doesn't exist, add it
        participationService.addParticipation(event, user);

        return new ResponseEntity<>("Participation added successfully", HttpStatus.OK);
    }

    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<String> deleteParticipation(@PathVariable Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

        Event event = eventService.getEventById(eventId);
        if (event == null) {
            return new ResponseEntity<>("Event not found", HttpStatus.NOT_FOUND);
        }

        boolean deleted = participationService.deleteParticipation(event, user);

        if (deleted) {
            return new ResponseEntity<>("Participation deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Participation not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all/{eventId}")
    public ResponseEntity<List<Participation>> getParticipationsByEvent(@PathVariable Long eventId) {
        List<Participation> participations = participationService.getParticipationsByEvent(eventId);

        if (participations.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(participations, HttpStatus.OK);
    }

    @GetMapping("/check/{eventId}")
    public ResponseEntity<?> getParticipationById(@PathVariable Long eventId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }

        Optional<Participation> participation = participationRepository.findByUserAndEventId(user.getId(), eventId);
        if (participation.isPresent()) {
            return new ResponseEntity<>("Participated", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Not participated", HttpStatus.OK);
        }
    }
}
