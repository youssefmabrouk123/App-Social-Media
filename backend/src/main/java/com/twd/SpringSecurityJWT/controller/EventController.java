package com.twd.SpringSecurityJWT.controller;

import com.sun.jdi.request.EventRequest;
import com.twd.SpringSecurityJWT.dto.ReqRes;
import com.twd.SpringSecurityJWT.entity.Event;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.service.EventService;
import com.twd.SpringSecurityJWT.service.ParticipationService;
import com.twd.SpringSecurityJWT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/users/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @Autowired
    private ParticipationService participationService;


    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestParam("eventName") String eventName,
                             @RequestParam("eventDescription") String eventDescription,
                             @RequestParam("eventDate") String eventDate,
                             @RequestParam("location") String location,
                             @RequestParam("organizer") String organizer,
                             @RequestParam("file") MultipartFile file) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            // Save the file to the filesystem
            String filename = eventService.saveFile(file);

            // Create a new event object and save it
            Event event = new Event();

            event.setUser(user);
            event.setEventName(eventName);
            event.setEventDescription(eventDescription);
            event.setEventDate(eventDate);
            event.setCreationDate(LocalDateTime.now());
            event.setLocation(location);
            event.setOrganizer(organizer);
            event.setFilename(filename);


            eventService.addEvent(event);

            return new ResponseEntity<>("Event created successfully", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Error while creating event", HttpStatus.BAD_REQUEST);
        }
    }


    @DeleteMapping("/del/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
        // Check if the event exists
        if (!eventService.existsById(eventId)) {
            return new ResponseEntity<>("Event not found", HttpStatus.NOT_FOUND);
        }

        participationService.deleteParticipationsByEventId(eventId);

        // Delete the event
        eventService.deleteEventById(eventId);
        return new ResponseEntity<>("Event deleted successfully", HttpStatus.OK);
    }


    @GetMapping("/all")
    //@PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Event>> getAllPosts() {
        List<Event> events = eventService.getAllEvents();
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else{
            return new ResponseEntity<>(events, HttpStatus.OK); }
    }


    @GetMapping("/allevents")
    public ResponseEntity<ReqRes> getAllEventsWithImages() {
        try {
            List<Event> events = eventService.getAllEvents();

            ReqRes reqRes = new ReqRes();

            List<ReqRes> eventsWithUserData = new ArrayList<>();

            for (Event event : events) {
                String imagePath = event.getFilename();
                Path file = Paths.get(imagePath);
                byte[] imageData = Files.readAllBytes(file);
                event.setImageData(imageData);

                OurUsers user = event.getUser();

                ReqRes eventWithUserData = new ReqRes();


                eventWithUserData.setUserId(event.getId());
                eventWithUserData.setRole(event.getUser().getRole());
                eventWithUserData.setEventName(event.getEventName());
                eventWithUserData.setEventDescription(event.getEventDescription());
                eventWithUserData.setOrganizer(event.getOrganizer());
                eventWithUserData.setEventId(event.getId());
                eventWithUserData.setEventDate(event.getEventDate());
                eventWithUserData.setCreationdate(event.getCreationDate());
                eventWithUserData.setLocation(event.getLocation());
                eventWithUserData.setUserId(user.getId());

                eventWithUserData.setImageData(imageData);

                eventsWithUserData.add(eventWithUserData);
            }

            reqRes.setEvent(eventsWithUserData);

            return new ResponseEntity<>(reqRes, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            ReqRes reqRes = new ReqRes();
            reqRes.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            reqRes.setMessage("Error fetching posts");
            return new ResponseEntity<>(reqRes, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{eventId}/imgprofil")
    public ResponseEntity<Resource> getEvntImgById(@PathVariable Long eventId) {
        try {
            // Fetch the event by its ID
            Event event = eventService.getEventById(eventId);
            if (event == null) {
                // If event not found, return 404 Not Found status
                return ResponseEntity.notFound().build();
            }

            // Get the user associated with the event
            OurUsers user = event.getUser();

            // Assuming imagePath is the path to the image file
            Path imagePath = Paths.get(user.getImage());
            Resource resource = new UrlResource(imagePath.toUri());

            // Return the image with proper content type
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (IOException e) {
            // Handle IO exception
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }
    @GetMapping("/{eventId}/img")
    public ResponseEntity<Resource> getImgById(@PathVariable Long eventId) {
        try {
            // Fetch the event by its ID
            Event event = eventService.getEventById(eventId);
            if (event == null) {
                // If event not found, return 404 Not Found status
                return ResponseEntity.notFound().build();
            }


            // Assuming imagePath is the path to the image file
            Path imagePath = Paths.get(event.getFilename());
            Resource resource = new UrlResource(imagePath.toUri());

            // Return the image with proper content type
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(resource);
        } catch (IOException e) {
            // Handle IO exception
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<ReqRes> getEventById(@PathVariable Long eventId) {
        // Fetch the post by its ID
        Event event = eventService.getEventById(eventId);
        if (event == null) {
            // If post not found, return 404 Not Found status
            return ResponseEntity.notFound().build();
        }

        OurUsers user = event.getUser();

        ReqRes eventWithUserData = new ReqRes();

        eventWithUserData.setUserId(event.getId());

        eventWithUserData.setFirstname(event.getUser().getFirstname());
        eventWithUserData.setLastname(event.getUser().getLastname());

        eventWithUserData.setEventName(event.getEventName());
        eventWithUserData.setEventDescription(event.getEventDescription());
        eventWithUserData.setOrganizer(event.getOrganizer());
        eventWithUserData.setEventId(event.getId());
        eventWithUserData.setEventDate(event.getEventDate());
        eventWithUserData.setCreationdate(event.getCreationDate());
        eventWithUserData.setLocation(event.getLocation());
        eventWithUserData.setUserId(user.getId());

        return new ResponseEntity<>(eventWithUserData, HttpStatus.OK);
    }

    @GetMapping("/img/{eventId}")
    public ResponseEntity<ReqRes> getEventImgById(@PathVariable Long eventId) {
        try {
            // Fetch the post by its ID
            Event event = eventService.getEventById(eventId);
            if (event == null) {
                // If post not found, return 404 Not Found status
                return ResponseEntity.notFound().build();
            }

            // Convert the post data to the desired format
            String imagePath = event.getFilename();
            Path file = Paths.get(imagePath);
            byte[] imageData = Files.readAllBytes(file);
            event.setImageData(imageData);

            OurUsers user = event.getUser();

            ReqRes eventWithUserData = new ReqRes();

            eventWithUserData.setUserId(event.getId());

            eventWithUserData.setEventId(event.getId());
            eventWithUserData.setUserId(user.getId());
            eventWithUserData.setImageData(imageData);

            return new ResponseEntity<>(eventWithUserData, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            ReqRes reqRes = new ReqRes();
            reqRes.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            reqRes.setMessage("Error fetching post");
            return new
                    ResponseEntity<>(reqRes, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
