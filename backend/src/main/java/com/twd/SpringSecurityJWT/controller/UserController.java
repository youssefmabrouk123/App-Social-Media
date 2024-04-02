package com.twd.SpringSecurityJWT.controller;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import com.twd.SpringSecurityJWT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
public class UserController {
    private static final String UPLOAD_DIR = "C:\\Users\\dell\\Desktop\\App_Social_Media\\backend\\profileimage";

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
        private UserService userService;
        @Autowired
        private OurUserRepo userRepository;

        @GetMapping("/getall")
        public ResponseEntity<List<OurUsers>> getAllUsers() {
            List<OurUsers> users = userService.getAllUsers();
            if (users.isEmpty()) {
                return ResponseEntity.noContent().build(); // Return 204 No Content if no users are found
            } else {
                return ResponseEntity.ok(users); // Return the list of users
            }
        }


        @GetMapping("/user")
        public OurUsers getUser() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            return userService.getUserByMail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }


        @DeleteMapping("/delete")
        public String deleteUser() {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            OurUsers user = userService.getUserByMail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            userRepository.delete(user);
            return "User deleted successfully";
        }


    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody OurUsers updatedUser) {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Fetch the user from the database by email
        OurUsers currentUser = userService.getUserByMail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use the ID of the authenticated user to update their information
        updatedUser.setId(currentUser.getId());

        // Update the user's information
        userService.updateUser(updatedUser);

        return ResponseEntity.ok("User updated successfully");
    }

    @PutMapping("/up")
    public String updatePost(
                             @RequestParam("firstname") String firstname,
                             @RequestParam("lastname") String lastname,
                             @RequestParam("age") String age,
                             @RequestParam("bio") String bio,
                             @RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return " error didn't exist";
        } else {
            try {
                // Save the file to the filesystem
                String filename = userService.saveImage(file);

                // Create a new Post object and save it
                //post.setId(id);

                user.setFirstname(firstname);
                user.setLastname(lastname);
                user.setAge(Integer.parseInt(age));
                user.setBio(bio);
                user.setImage(filename);
                userService.userUpdate(user);

                return "Post created successfully";
            } catch (IOException e) {
                return "Error creating post: " + e.getMessage();
            }
        }

    }

}

