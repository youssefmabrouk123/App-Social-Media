package com.twd.SpringSecurityJWT.service;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import com.twd.SpringSecurityJWT.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;
    // Define the upload directory
    private static final String UPLOAD_DIR = "C:\\Users\\dell\\Desktop\\UML\\backend\\postimguploads";

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

    public void savePost(Post post) {
        // Save the post to the database using repository methods
        postRepository.save(post);
    }
}
