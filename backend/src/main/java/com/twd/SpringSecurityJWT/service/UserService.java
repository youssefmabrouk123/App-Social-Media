package com.twd.SpringSecurityJWT.service;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private OurUserRepo userRepository;

    public List<OurUsers> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<OurUsers> getUserByMail(String username) {

        return userRepository.findByEmail(username);
    }


//    public Optional<OurUsers> getUserbyId(String id) {
//        return userRepository.findByEmail(id);
//    }


//    public Optional<OurUsers> getUserById(String id) {
//        return userRepository.findById(id);
//    }
}
