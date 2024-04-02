    package com.twd.SpringSecurityJWT.controller;
    import com.twd.SpringSecurityJWT.entity.Post;
    import com.twd.SpringSecurityJWT.entity.OurUsers;
    import com.twd.SpringSecurityJWT.repository.OurUserRepo;
    import com.twd.SpringSecurityJWT.service.PostService;
    import com.twd.SpringSecurityJWT.service.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.core.Authentication;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.File;
    import java.io.IOException;
    import java.time.LocalDateTime;
    import java.util.Collections;
    import java.util.List;

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
//                post.setLikedByUsers(Collections.emptyList());
//                post.setSavedByUsers(Collections.emptyList());
                postService.savePost(post);

                return "Post created successfully";
            } catch (IOException e) {
                return "Error creating post: " + e.getMessage();
            }
        }

        @DeleteMapping("delete/{postId}")
        public ResponseEntity<?> deletePost(@PathVariable Long postId) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            OurUsers userpost = userService.getUserByMail(username).orElse(null);



            // Check if the post exists
            Post post = postService.getPostById(postId);
            if (post == null) {
                return ResponseEntity.notFound().build();
            } else if (post.getUser().equals(userpost)) {
                File file = new File(post.getFilename());
                if (file.exists()) {
                    file.delete(); // Delete the filerd'e
                }

                postService.deletePost(post);
                return ResponseEntity.ok().body("post deleted avec success");}

            return ResponseEntity.notFound().build();
        }



        @PutMapping("update/{postId}")
        public String updatePost(@PathVariable Long postId,
                                            @RequestParam("userid") String userid,
                                            @RequestParam("caption") String caption,
                                            @RequestParam("location") String location,
                                            @RequestParam("tags") String tags,
                                            @RequestParam("file") MultipartFile file) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            OurUsers userpost = userService.getUserByMail(username).orElse(null);



            // Check if the post exists
            Post post = postService.getPostById(postId);
            if (post == null) {
                return " error didn't exist";
            } else if (post.getUser().equals(userpost)) {
                try {
                    // Save the file to the filesystem
                    String filename = postService.saveFile(file);

                    // Create a new Post object and save it
                    //post.setId(id);
                    post.setCaption(caption);
                    post.setLocation(location);
                    post.setTags(tags);
                    post.setFilename(filename);
                    post.setCreationdate(LocalDateTime.now());
                    postService.savePost(post);

                    return "Post created successfully";
                } catch (IOException e) {
                    return "Error creating post: " + e.getMessage();
                }
                }

            return "error didn't updated ";
        }


        @GetMapping("/all") // Define the endpoint for getting all posts
        public ResponseEntity<List<Post>> getAllPosts() {
            List<Post> posts = postService.getAllPosts();
            if (posts.isEmpty()) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.ok(posts);
            }
        }
    }




