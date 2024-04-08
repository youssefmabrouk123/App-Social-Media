    package com.twd.SpringSecurityJWT.controller;
    import com.twd.SpringSecurityJWT.dto.ReqRes;
    import com.twd.SpringSecurityJWT.entity.Post;
    import com.twd.SpringSecurityJWT.entity.OurUsers;
    import com.twd.SpringSecurityJWT.repository.OurUserRepo;
    import com.twd.SpringSecurityJWT.service.PostService;
    import com.twd.SpringSecurityJWT.service.UserService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.core.io.ByteArrayResource;
    import org.springframework.http.MediaType;
    import org.springframework.security.access.prepost.PreAuthorize;
    import org.springframework.security.core.Authentication;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;
    import org.springframework.core.io.Resource;

    import java.io.File;
    import java.io.IOException;
    import java.nio.file.Files;
    import java.nio.file.Path;
    import java.nio.file.Paths;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
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
                post.setUser(userService.getUserById(Long.valueOf(userid)));
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

        @GetMapping("/image/{postId}")
        public ResponseEntity<Resource> getPostImage(@PathVariable Long postId) {
            Post post = postService.getPostById(postId);
            if (post == null) {
                return ResponseEntity.notFound().build();
            }
            String imagePath = post.getFilename();
            try {
                Path file = Paths.get(imagePath);
                ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(file));

                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;" + imagePath )
                        .body(resource);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        /*@GetMapping("/allposts")
        public ResponseEntity<List<Post>> getAllPostsWithImages() {
            List<Post> posts = postService.getAllPosts();

            for (Post post : posts) {
                try {
                    String imagePath = post.getFilename();
                    Path file = Paths.get(imagePath);
                    byte[] imageData = Files.readAllBytes(file);
                    post.setImageData(imageData);
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
                }
            }

            return new ResponseEntity<>(posts, HttpStatus.OK);
        }*/

        @GetMapping("/allposts")
        public ResponseEntity<ReqRes> getAllPostsWithImages() {
            try {
                List<Post> posts = postService.getAllPosts();

                ReqRes reqRes = new ReqRes();
                reqRes.setStatusCode(HttpStatus.OK.value());
                reqRes.setMessage("Success");

                List<ReqRes> postsWithUserData = new ArrayList<>();

                for (Post post : posts) {
                    String imagePath = post.getFilename();
                    Path file = Paths.get(imagePath);
                    byte[] imageData = Files.readAllBytes(file);
                    post.setImageData(imageData);

                    OurUsers user = post.getUser();

                    ReqRes postWithUserData = new ReqRes();
                    postWithUserData.setCaption(post.getCaption());
                    postWithUserData.setLocation(post.getLocation());
                    postWithUserData.setTags(post.getTags());
                    postWithUserData.setCreationdate(post.getCreationdate());
                    postWithUserData.setFilename(post.getFilename());
                    postWithUserData.setFirstname(user.getFirstname());
                    postWithUserData.setLastname(user.getLastname());
                    postWithUserData.setImageData(imageData);

                    postsWithUserData.add(postWithUserData);
                }

                reqRes.setPost(postsWithUserData);

                return new ResponseEntity<>(reqRes, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                ReqRes reqRes = new ReqRes();
                reqRes.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
                reqRes.setMessage("Error fetching posts");
                return new ResponseEntity<>(reqRes, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }



        @GetMapping("/post/{id}")
        public ResponseEntity<ReqRes> getPostsWithImages(@PathVariable Long id) {
            try {
                Post post = postService.getPostById(id);

//                ReqRes reqRes = new ReqRes();
//                reqRes.setStatusCode(HttpStatus.OK.value());
//                reqRes.setMessage("Success");

                //List<ReqRes> postsWithUserData = new ArrayList<>();

                    String imagePath = post.getFilename();
                    Path file = Paths.get(imagePath);
                    byte[] imageData = Files.readAllBytes(file);
                    post.setImageData(imageData);

                    OurUsers user = post.getUser();

                    ReqRes postWithUserData = new ReqRes();
                    postWithUserData.setCaption(post.getCaption());
                    postWithUserData.setLocation(post.getLocation());
                    postWithUserData.setTags(post.getTags());
                    postWithUserData.setCreationdate(post.getCreationdate());
                    postWithUserData.setFilename(post.getFilename());
                    postWithUserData.setImageData(imageData);
                    postWithUserData.setNbrLikes(post.getLikedByUsers().size());







                return new ResponseEntity<>(postWithUserData, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                ReqRes reqRes = new ReqRes();
                reqRes.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
                reqRes.setMessage("Error fetching posts");
                return new ResponseEntity<>(reqRes, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }






    }




