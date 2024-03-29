package com.twd.SpringSecurityJWT.controller;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import com.twd.SpringSecurityJWT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;



    @GetMapping("/getall")
    public List<OurUsers> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/user")
    public Optional<OurUsers> getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Optional<OurUsers> user = userService.getUserByMail(username);
        return user;
    }

//    @GetMapping("/user")
//    public String getUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        return "Authenticated user: " + authentication.getName();
//    }


//    @GetMapping("/getUser/{id}")
//    public <OurUsers>  getUserbyId(String id) {
//        return userService.getUserbyId(id);
//    }

//    @GetMapping("/getid/{id}")
//    public Optional<OurUsers> getUserById(String id) {
//        return userService.getUserById(id);
//    }
}
