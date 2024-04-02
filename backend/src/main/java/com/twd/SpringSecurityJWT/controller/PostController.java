    package com.twd.SpringSecurityJWT.controller;
    import com.twd.SpringSecurityJWT.entity.Post;
    import com.twd.SpringSecurityJWT.entity.OurUsers;
    import com.twd.SpringSecurityJWT.repository.OurUserRepo;
    import com.twd.SpringSecurityJWT.service.PostService;
    import com.twd.SpringSecurityJWT.service.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;
    import java.io.IOException;
    import java.time.LocalDateTime;
    import java.util.Collections;

    @RestController
    @RequestMapping("auth/posts")
    public class PostController {

        @Autowired
        private PostService postService;

        @Autowired
        private UserService userService;

        @PostMapping("/create")
        public String createPost(@RequestParam("userid") String userid,
                                 @RequestParam("caption") String caption,
                                 @RequestParam("location") String location,
                                 @RequestParam("tags") String tags,
                                 @RequestParam("file") MultipartFile file) {
            try {
                // Save the file to the filesystem
                String filename = postService.saveFile(file);

                // Create a new Post object and save it
                Post post = new Post();

                //post.setId(id);
                post.setCaption(caption);
                post.setLocation(location);
                post.setTags(tags);
                post.setFilename(filename);
                post.setCreationdate(LocalDateTime.now());
                post.setUser(userService.getUserById(Integer.parseInt(userid)));
                post.setLikedByUsers(Collections.emptyList());
                post.setSavedByUsers(Collections.emptyList());
                postService.savePost(post);

                return "Post created successfully";
            } catch (IOException e) {
                return "Error creating post: " + e.getMessage();
            }
        }
    }
