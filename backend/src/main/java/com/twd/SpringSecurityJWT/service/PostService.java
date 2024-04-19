package com.twd.SpringSecurityJWT.service;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;


    //private static final String UPLOAD_DIR = "C:\\Users\\dell\\Desktop\\App_Social_Media\\backend\\postimguploads";
    private static final String UPLOAD_DIR = "C:\\Users\\arway\\Desktop\\New folder (2)\\App-Social-Media\\backend\\postimguploads";

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
    public List<Post> getAllPosts() {
        // Retrieve all posts from the database using repository method
        return postRepository.findAll();
    }
    public Post getPostById(Long postid) {
        // Save the post to the database using repository methods
        return postRepository.findById(postid).orElse(null);}
    public void deletePostById(Long postId) {
        // Delete the post from the database using repository method
        postRepository.deleteById(postId);
    }
}
