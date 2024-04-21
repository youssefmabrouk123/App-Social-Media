package com.twd.SpringSecurityJWT.service;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.InteractionRepository;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import com.twd.SpringSecurityJWT.repository.PostRepository;
import com.twd.SpringSecurityJWT.repository.SavedPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@Service
public class UserService {
    @Autowired
    private OurUserRepo userRepository;
    @Autowired
    private PostService postService;
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private InteractionRepository interactionRepository;

    @Autowired
    private SavedPostRepository savedPostRepository;



    private static final String UPLOAD_DIR = "C:\\Users\\arway\\Desktop\\New folder (2)\\App-Social-Media\\backend\\profileimage";

    //private static final String UPLOAD_DIR = "C:\\Users\\dell\\Desktop\\App_Social_Media\\backend\\profileimage";



    public List<OurUsers> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<OurUsers> getUserByMail(String username) {

        return userRepository.findByEmail(username);
    }

    public OurUsers getUserById(Long id) {
        Optional<OurUsers> userOptional = userRepository.findById(id);
        return userOptional.orElse(null); // Or handle the case where user is not found
    }


    public String saveImage(MultipartFile file) throws IOException {
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
    public void userUpdate(OurUsers user) {
        // Save the post to the database using repository methods
        userRepository.save(user);
    }

    @Transactional
    public void deleteUserAndRelatedInfo(OurUsers user) {
        // Delete user's interactions
        interactionRepository.deleteByUser(user);

        // Delete user's saved posts
        savedPostRepository.deleteByUser(user);

        // Delete user's posts
        postRepository.deleteByUser(user);

        // Delete user
        userRepository.delete(user);
    }

    public ResponseEntity<List<Post>> getPostsByUserId(Long userId) {
        Optional<OurUsers> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            OurUsers user = userOptional.get();
            return ResponseEntity.ok(user.getPosts());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public Resource getUserProfileImage() throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return null; // or throw UnauthorizedException
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        Optional<OurUsers> userOptional = userRepository.findByEmail(username);
        if (userOptional.isPresent()) {
            OurUsers user = userOptional.get();
            if (user.getImage() != null) {
                Path imagePath = Paths.get(user.getImage());
                Resource resource = new UrlResource(imagePath.toUri());
                if (resource.exists() || resource.isReadable()) {
                    return resource;
                } else {
                    throw new IOException("Failed to read the profile image");
                }
            } else {
                throw new IOException("Profile image not found for the user");
            }
        } else {
            throw new IOException("User not found");
        }
    }

    public Resource getUserProfileImg(Long userId) throws IOException {
        Optional<OurUsers> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            OurUsers user = userOptional.get();
            if (user.getImage() != null) {
                Path imagePath = Paths.get(user.getImage());
                Resource resource = new UrlResource(imagePath.toUri());
                if (resource.exists() && resource.isReadable()) {
                    return resource;
                } else {
                    // Image not found or not readable, return null or empty string
                    return null; // or return new ByteArrayResource(new byte[0]);
                }
            } else {
                // Image path is null, return null or empty string
                return null; // or return new ByteArrayResource(new byte[0]);
            }
        } else {
            // User not found, return null or empty string
            return null; // or return new ByteArrayResource(new byte[0]);
        }
    }

    public static int calculateAge(String birthDateString) {
        // Parse the birth date string into a LocalDate object
        LocalDate birthDate = LocalDate.parse(birthDateString);

        // Get the current date
        LocalDate currentDate = LocalDate.now();

        // Calculate the period between the birth date and current date
        Period period = Period.between(birthDate, currentDate);

        // Get the years part of the period
        int age = period.getYears();

        // Return the calculated age
        return age;
    }
}