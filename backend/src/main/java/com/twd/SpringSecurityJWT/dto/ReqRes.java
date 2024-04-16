package com.twd.SpringSecurityJWT.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Post;
import com.twd.SpringSecurityJWT.entity.Product;
import com.twd.SpringSecurityJWT.entity.SavedPost;
import lombok.Data;
import org.apache.tomcat.util.file.ConfigurationSource;
import org.springframework.core.io.Resource;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReqRes {

    private Long postId;
    private Long userId;
    private Long savedId;
    private Integer interactions;
    private Integer statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String name;
    private String firstname;
    private String lastname;
    private String email;
    private String role;
    private String password;
    private Integer age;
    private String bio;
    private String filiere;
    private String image;
    private List<Product> products;
    private OurUsers ourUsers;
    private String caption;
    private String filename;
    private String location;
    private String tags;
    private List<Post> posts; // Add a field for posts
    private List<SavedPost> savedPosts; // Add a field for saved posts
    private byte[] imageData;
    private byte[] imageProfilData;
    private LocalDateTime creationdate;
    private List<ReqRes> post;
    private Boolean liked ;
    private Boolean saved ;
    private Resource imge ;
}
