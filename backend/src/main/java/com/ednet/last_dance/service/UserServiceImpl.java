package com.ednet.last_dance.service;
// UserServiceImpl.java

import com.ednet.last_dance.model.User;
import com.ednet.last_dance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User addUser(User user) {
        String username = user.getUsername();
        String email = user.getMail();

        // Check if username already exists
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username " + username + " already exists");
        }

        // Check if email already exists
        if (userRepository.existsByMail(email)) {
            throw new IllegalArgumentException("User with email " + email + " already exists");
        }

        // If both username and email are unique, save the user
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, User user) {
        if (!userRepository.existsById(id)) {
            return null;
        }
        user.setIdUser(id);
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
