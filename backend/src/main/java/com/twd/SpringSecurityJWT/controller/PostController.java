    package com.twd.SpringSecurityJWT.controller;
    import com.twd.SpringSecurityJWT.entity.Post;
    import com.twd.SpringSecurityJWT.entity.OurUsers;
    import com.twd.SpringSecurityJWT.repository.OurUserRepo;
    import com.twd.SpringSecurityJWT.service.PostService;
    import com.twd.SpringSecurityJWT.service.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.access.prepost.PreAuthorize;
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

    @RequestMapping("/users/posts")
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
        @GetMapping("/all")
        //@PreAuthorize("hasRole('USER')") // Restrict access to authorized users
        public ResponseEntity<List<Post>> getAllPosts() {
            // Retrieve all posts using PostService
            List<Post> posts = postService.getAllPosts();
            return new ResponseEntity<>(posts, HttpStatus.OK);
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

        //@PreAuthorize("hasRole('USER')")
        @DeleteMapping("/{postId}")
        public ResponseEntity<String> deletePost(@PathVariable Long postId) {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            OurUsers user = userService.getUserByMail(username).orElse(null);

            // Get the post by its ID
            Post post = postService.getPostById(postId);
            if (post == null) {
                // Post does not exist
                return new ResponseEntity<>("Post not found", HttpStatus.NOT_FOUND);
            }

            // Check if the authenticated user is the owner of the post
            if (!post.getUser().equals(user)) {
                // User is not the owner of the post
                return new ResponseEntity<>("You are not authorized to delete this post", HttpStatus.UNAUTHORIZED);
            }

            // Delete the post
            postService.deletePostById(postId);
            return new ResponseEntity<>("Post deleted successfully", HttpStatus.OK);
        }
    }




