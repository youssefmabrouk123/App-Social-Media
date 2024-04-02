package com.twd.SpringSecurityJWT.service;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private OurUserRepo userRepository;
    @Autowired
    private PostService postService;


    private static final String UPLOAD_DIR = "C:\\Users\\dell\\Desktop\\App_Social_Media\\backend\\profileimage ";


    public List<OurUsers> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<OurUsers> getUserByMail(String username) {

        return userRepository.findByEmail(username);
    }

    public OurUsers getUserById(Integer id) {
        Optional<OurUsers> userOptional = userRepository.findById(id);
        return userOptional.orElse(null); // Or handle the case where user is not found
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

        return UPLOAD_DIR + "/" + filename;
    }

    public OurUsers updateUser(OurUsers updatedUser) {
        // Fetch the user from the database by id
        OurUsers currentUser = userRepository.findById(updatedUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        //String filename = postService.saveFile(file);

        // Update the user's information
        currentUser.setFirstname(updatedUser.getFirstname());
        currentUser.setLastname(updatedUser.getLastname());
        currentUser.setAge(updatedUser.getAge());
        currentUser.setBio(updatedUser.getBio());
        currentUser.setFiliere(updatedUser.getFiliere());
        currentUser.setImage(updatedUser.getImage());
        // Update other fields as needed

        // Save the updated user to the database
        return userRepository.save(currentUser);
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


}