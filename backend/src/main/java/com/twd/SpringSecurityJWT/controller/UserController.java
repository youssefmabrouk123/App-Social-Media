package com.twd.SpringSecurityJWT.controller;

import com.twd.SpringSecurityJWT.dto.ReqRes;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import com.twd.SpringSecurityJWT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/users")
public class UserController {

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

    @GetMapping("/userdetail/{id}")
    public OurUsers getUserDetail(@PathVariable Long id) {
        OurUsers user = userService.getUserById(id);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }


    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username)
                .orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        userService.deleteUserAndRelatedInfo(user);

        return new ResponseEntity<>("User and related information deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/up")
    public String updatePost(
            @RequestParam("firstname") String firstname,
            @RequestParam("lastname") String lastname,
            @RequestParam("age") String age,
            @RequestParam("bio") String bio,
            @RequestParam("filiere") String filiere,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null) {
            return " error didn't exist";
        } else {
            try {
                if (file != null && !file.isEmpty()) {

                    String filename = userService.saveImage(file);
                    user.setImage(filename);

                }

                // Create a new Post object and save it
                //post.setId(id);

                user.setFirstname(firstname);
                user.setLastname(lastname);
                user.setAge(Integer.parseInt(age));
                user.setBio(bio);
                user.setFiliere(filiere);



                userService.userUpdate(user);

                return "Post created successfully";
            } catch (IOException e) {
                return "Error creating post: " + e.getMessage();
            }
        }

    }

    @GetMapping("/{userId}/posts")
    public ResponseEntity<?> getPostsByUserId(@PathVariable Long userId) {
        ResponseEntity<List<Post>> response = userService.getPostsByUserId(userId);
        if (response.getStatusCode() == HttpStatus.OK) {
            List<Post> posts = response.getBody();
            return ResponseEntity.ok(posts);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/profile-image")
    public ResponseEntity<Resource> getUserProfileImage() throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        OurUsers user = userService.getUserByMail(username).orElse(null);

        if (user == null || user.getImage() == null) {
            return ResponseEntity.notFound().build();
        } else {
            Path imagePath = Paths.get(user.getImage());
            Resource resource = new UrlResource(imagePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }
    }



    @GetMapping("/profileimagebyid/{id}")
    public ResponseEntity<Resource> getUserProfileImageById(@PathVariable Long id) throws IOException {
        OurUsers user = userService.getUserById(id);

        if (user == null || user.getImage() == null) {
            return ResponseEntity.notFound().build();
        } else {
            Path imagePath = Paths.get(user.getImage());
            Resource resource = new UrlResource(imagePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        }
    }

    ///////////////////

    @GetMapping("/allusers")
    public ResponseEntity<List<ReqRes>> getUsers() throws IOException {
        List<OurUsers> users = userService.getAllUsers();
        List<ReqRes> usersWithImageUrls = new ArrayList<>();

        for (OurUsers user : users) {
            ReqRes reqRes = new ReqRes();
            reqRes.setUserId(user.getId());
            reqRes.setFirstname(user.getFirstname());
            reqRes.setLastname(user.getLastname());
            reqRes.setEmail(user.getEmail());

            byte[] userProfileImage = getUserProfileImage(user.getId());
            reqRes.setImageProfilData(userProfileImage);

            usersWithImageUrls.add(reqRes);
        }

        return ResponseEntity.ok(usersWithImageUrls); // Return ResponseEntity with status OK and body
    }


    private byte[] getUserProfileImage(Long userId) throws IOException {
        Resource userProfileImageResource = userService.getUserProfileImg(userId);
        if (userProfileImageResource != null) {
            Path imagePath = userProfileImageResource.getFile().toPath();
            return Files.readAllBytes(imagePath);
        } else {
            return null;
        }
    }
    ///////////
}


