    package com.twd.SpringSecurityJWT.controller;

    import com.twd.SpringSecurityJWT.dto.ReqRes;
    import com.twd.SpringSecurityJWT.entity.Interaction;
    import com.twd.SpringSecurityJWT.entity.Post;
    import com.twd.SpringSecurityJWT.entity.OurUsers;
    import com.twd.SpringSecurityJWT.entity.SavedPost;
    import com.twd.SpringSecurityJWT.repository.OurUserRepo;
    import com.twd.SpringSecurityJWT.repository.SavedPostRepository;
    import com.twd.SpringSecurityJWT.service.InteractionService;
    import com.twd.SpringSecurityJWT.service.PostService;
    import com.twd.SpringSecurityJWT.service.SavedPostService;
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
    import static java.lang.System.out;


    @RestController

    @RequestMapping("/users/posts")
    public class PostController {

        @Autowired
        private PostService postService;

        @Autowired
        private UserService userService;
        @Autowired
        private InteractionService interactionService;

        @Autowired
        private SavedPostService savedPostService;

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

//
        @PutMapping("update/{postId}")
        public String updatePost(@PathVariable Long postId,
                                 @RequestParam("caption") String caption,
                                 @RequestParam("location") String location,
                                 @RequestParam("tags") String tags,
                                 @RequestParam("file") MultipartFile file) {


            // Check if the post exists
            Post post = postService.getPostById(postId);

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
            interactionService.deleteInteractionsByPostId(postId);
            savedPostService.deleteSavedPostByPostId(postId);

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


        @GetMapping("/allposts")
        public ResponseEntity<ReqRes> getAllPostsWithImages() {
            try {
                List<Post> posts = postService.getAllPosts();

                ReqRes reqRes = new ReqRes();

                List<ReqRes> postsWithUserData = new ArrayList<>();

                for (Post post : posts) {
                    String imagePath = post.getFilename();
                    Path file = Paths.get(imagePath);
                    byte[] imageData = Files.readAllBytes(file);
                    post.setImageData(imageData);

                    OurUsers user = post.getUser();

                    ReqRes postWithUserData = new ReqRes();


                    postWithUserData.setPostId(post.getId()); // Set post ID
                    postWithUserData.setCaption(post.getCaption());
                    postWithUserData.setLocation(post.getLocation());
                    postWithUserData.setTags(post.getTags());
                    postWithUserData.setCreationdate(post.getCreationdate());
                    postWithUserData.setInteractions(post.getLikedByUsers().size());
                    postWithUserData.setUserId(user.getId());
                    //postWithUserData.setFirstname(user.getFirstname());
                    //postWithUserData.setLastname(user.getLastname());
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
        @GetMapping("/allpostsowner")
        public ResponseEntity<ReqRes> getAllPostsOwner() {
            try {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                OurUsers userCurr = userService.getUserByMail(username).orElse(null);

                ReqRes reqRes = new ReqRes();

                if (userCurr == null) {
                    reqRes.setMessage("Error fetching posts");
                    reqRes.setStatusCode(HttpStatus.FORBIDDEN.value());
                    return new ResponseEntity<>(reqRes , HttpStatus.FORBIDDEN);
                }


                List<Post> posts = postService.getAllPosts();


                List<ReqRes> postsWithUserData = new ArrayList<>();

                for (Post post : posts) {

                    OurUsers user = post.getUser();

                    byte[] userProfileImage = getUserProfileImage(user.getId());


                    List<Interaction> likes = userCurr.getLikedInteractions();
                    boolean isPostLiked = false;
                    if (likes != null) {
                        isPostLiked = likes.stream()
                                .anyMatch(interaction -> interaction.getPost().getId().equals(post.getId()));
                    }

                    List<SavedPost> savedPosts = userCurr.getSavedPosts();
                    boolean isPostSaved = false;
                    if (savedPosts != null) {
                        isPostSaved = savedPosts.stream()
                                .anyMatch(savedPost -> savedPost.getPost().getId().equals(post.getId()));
                    }

                    ReqRes postWithUserData = new ReqRes();

                    postWithUserData.setPostId(post.getId());
                    postWithUserData.setUserId(user.getId());
                    postWithUserData.setFirstname(user.getFirstname());
                    postWithUserData.setLastname(user.getLastname());
                    postWithUserData.setLiked(isPostLiked);
                    postWithUserData.setSaved(isPostSaved);
                    postWithUserData.setImageProfilData(userProfileImage);

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


        @GetMapping("/all/{postId}")
        public ResponseEntity<ReqRes> getPostById(@PathVariable Long postId) {
            try {
                // Fetch the post by its ID
                Post post = postService.getPostById(postId);
                if (post == null) {
                    // If post not found, return 404 Not Found status
                    return ResponseEntity.notFound().build();
                }

                // Convert the post data to the desired format
                String imagePath = post.getFilename();
                Path file = Paths.get(imagePath);
                byte[] imageData = Files.readAllBytes(file);
                post.setImageData(imageData);

                OurUsers user = post.getUser();

                ReqRes postWithUserData = new ReqRes();
                postWithUserData.setPostId(post.getId());
                postWithUserData.setCaption(post.getCaption());
                postWithUserData.setLocation(post.getLocation());
                postWithUserData.setTags(post.getTags());
                postWithUserData.setCreationdate(post.getCreationdate());
                postWithUserData.setInteractions(post.getLikedByUsers().size());
                postWithUserData.setUserId(user.getId());
                // Set other user data as needed
                postWithUserData.setImageData(imageData);

                return new ResponseEntity<>(postWithUserData, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                ReqRes reqRes = new ReqRes();
                reqRes.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
                reqRes.setMessage("Error fetching post");
                return new ResponseEntity<>(reqRes, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @GetMapping("/postsowner/{postId}")
        public ResponseEntity<ReqRes> getPostsOwner(@PathVariable Long postId) {
            try {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String username = authentication.getName();
                OurUsers userCurr = userService.getUserByMail(username).orElse(null);

                ReqRes reqRes = new ReqRes();

                if (userCurr == null) {
                    reqRes.setMessage("Error fetching posts");
                    reqRes.setStatusCode(HttpStatus.FORBIDDEN.value());
                    return new ResponseEntity<>(reqRes , HttpStatus.FORBIDDEN);
                }


                Post post = postService.getPostById(postId);
                OurUsers user = post.getUser();
                byte[] userProfileImage = getUserProfileImage(user.getId());
                List<Interaction> likes = userCurr.getLikedInteractions();
                boolean isPostLiked = false;
                    if (likes != null) {
                        isPostLiked = likes.stream()
                                .anyMatch(interaction -> interaction.getPost().getId().equals(post.getId()));
                    }

                    List<SavedPost> savedPosts = userCurr.getSavedPosts();
                    boolean isPostSaved = false;
                    if (savedPosts != null) {
                        isPostSaved = savedPosts.stream()
                                .anyMatch(savedPost -> savedPost.getPost().getId().equals(post.getId()));
                    }

                    ReqRes postWithUserData = new ReqRes();

                    postWithUserData.setPostId(post.getId());
                    postWithUserData.setUserId(user.getId());
                    postWithUserData.setFirstname(user.getFirstname());
                    postWithUserData.setLastname(user.getLastname());
                    postWithUserData.setLiked(isPostLiked);
                    postWithUserData.setSaved(isPostSaved);
                    postWithUserData.setImageProfilData(userProfileImage);


                return new ResponseEntity<>(postWithUserData, HttpStatus.OK);
            } catch (IOException e) {
                e.printStackTrace();
                ReqRes reqRes = new ReqRes();
                reqRes.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
                reqRes.setMessage("Error fetching posts");
                return new ResponseEntity<>(reqRes, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }


        @GetMapping("/getInteraction/{postId}")
        public ResponseEntity<ReqRes> getInteraction(@PathVariable Long postId) {

                    Post post=postService.getPostById(postId);
                    ReqRes postInteraction = new ReqRes();
                postInteraction.setInteractions(post.getLikedByUsers().size());

                return new ResponseEntity<>(postInteraction, HttpStatus.OK);

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





    }




