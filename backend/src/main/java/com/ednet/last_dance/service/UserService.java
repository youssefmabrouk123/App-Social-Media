package com.ednet.last_dance.service;
// UserService.java

import com.ednet.last_dance.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User addUser(User user);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}
