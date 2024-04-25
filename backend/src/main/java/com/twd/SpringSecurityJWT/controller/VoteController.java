package com.twd.SpringSecurityJWT.controller;

import com.twd.SpringSecurityJWT.entity.OurUsers;
import com.twd.SpringSecurityJWT.entity.Vote;
import com.twd.SpringSecurityJWT.repository.OurUserRepo;
import com.twd.SpringSecurityJWT.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("users/api/votes")
public class VoteController {

    private final VoteRepository voteRepository;
    private final OurUserRepo userRepository;

    @Autowired
    public VoteController(VoteRepository voteRepository, OurUserRepo userRepository) {
        this.voteRepository = voteRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Vote> createVote(@PathVariable Long userId,
                                           @RequestParam("question") String question,
                                           @RequestParam("description") String description) {
        // Assuming you have the authenticated user's ID, you can use it to set the initiator
        OurUsers initiator = userRepository.findById(userId).orElse(null);

        if (initiator == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Vote vote = new Vote();
        vote.setQuestion(question);
        vote.setDescription(description);
        vote.setDate(LocalDateTime.now());
        vote.setInitiator(initiator);

        Vote createdVote = voteRepository.save(vote);

        return new ResponseEntity<>(createdVote, HttpStatus.CREATED);
    }


//    @PostMapping("/{voteId}/vote")
//    public ResponseEntity<?> vote(@PathVariable Long voteId,
//                                  @RequestParam("userId") Long userId,
//                                  @RequestParam("vote") String vote) {
//        // Fetch the vote entity from the repository
//        Vote voteEntity = voteRepository.findById(voteId).orElse(null);
//
//        if (voteEntity == null) {
//            return new ResponseEntity<>("Vote not found", HttpStatus.NOT_FOUND);
//        }
//
//        // Fetch the user from the repository
//        OurUsers user = userRepository.findById(userId).orElse(null);
//
//        if (user == null) {
//            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
//        }
//
//        // Check if the vote value is valid
//        if (!vote.equals("yes") && !vote.equals("no")) {
//            return new ResponseEntity<>("Invalid vote value", HttpStatus.BAD_REQUEST);
//        }
//
//        // Check if the user has already voted
//        if (vote.equals("yes")) {
//            if (voteEntity.getUsersVotedYes().contains(user)) {
//                return new ResponseEntity<>("User has already voted Yes", HttpStatus.BAD_REQUEST);
//            }
//            voteEntity.getUsersVotedYes().add(user);
//            voteEntity.setYesCount(voteEntity.getYesCount() + 1);
//        } else { // vote.equals("no")
//            if (voteEntity.getUsersVotedNo().contains(user)) {
//                return new ResponseEntity<>("User has already voted No", HttpStatus.BAD_REQUEST);
//            }
//            voteEntity.getUsersVotedNo().add(user);
//            voteEntity.setNoCount(voteEntity.getNoCount() + 1);
//        }
//
//        // Save the updated vote entity
//        Vote updatedVote = voteRepository.save(voteEntity);
//
//        return new ResponseEntity<>(updatedVote, HttpStatus.OK);
//    }
//
    @PostMapping("/{voteId}/vote")
    public ResponseEntity<?> vote(@PathVariable Long voteId,
                                  @RequestParam("userId") Long userId,
                                  @RequestParam("vote") String vote) {
        // Fetch the vote entity from the repository

        Vote voteEntity = voteRepository.findById(voteId).orElse(null);

        if (voteEntity == null) {
            return new ResponseEntity<>("Vote not found", HttpStatus.NOT_FOUND);
        }

        // Fetch the user from the repository
        OurUsers user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        // Check if the vote value is valid
        if (!vote.equals("yes") && !vote.equals("no")) {
            return new ResponseEntity<>("Invalid vote value", HttpStatus.BAD_REQUEST);
        }

        // Check if the user has already voted
        if (vote.equals("yes")) {
            if (voteEntity.getUsersVotedYes().contains(user)) {
                return new ResponseEntity<>("User has already voted Yes", HttpStatus.BAD_REQUEST);
            }
            // If the user has voted "no", return bad request
            if (voteEntity.getUsersVotedNo().contains(user)) {
                return new ResponseEntity<>("User has already voted No", HttpStatus.BAD_REQUEST);
            }
            voteEntity.getUsersVotedYes().add(user);
            voteEntity.setYesCount(voteEntity.getYesCount() + 1);
        } else { // vote.equals("no")
            if (voteEntity.getUsersVotedNo().contains(user)) {
                return new ResponseEntity<>("User has already voted No", HttpStatus.BAD_REQUEST);
            }
            // If the user has voted "yes", return bad request
            if (voteEntity.getUsersVotedYes().contains(user)) {
                return new ResponseEntity<>("User has already voted Yes", HttpStatus.BAD_REQUEST);
            }
            voteEntity.getUsersVotedNo().add(user);
            voteEntity.setNoCount(voteEntity.getNoCount() + 1);
        }

        // Save the updated vote entity
        Vote updatedVote = voteRepository.save(voteEntity);

        return new ResponseEntity<>(updatedVote, HttpStatus.OK);
    }
//
//////////////////
//    @PostMapping("/{voteId}/vote")
//    public ResponseEntity<?> vote(@PathVariable Long voteId,
//                                  @RequestParam("userId") Long userId,
//                                  @RequestParam("vote") String vote) {
//        Vote voteEntity = voteRepository.findById(voteId).orElse(null);
//
//        if (voteEntity == null) {
//            return new ResponseEntity<>("Vote not found", HttpStatus.NOT_FOUND);
//        }
//
//        OurUsers user = userRepository.findById(userId).orElse(null);
//
//        if (user == null) {
//            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
//        }
//
//        if (!vote.equals("yes") && !vote.equals("no")) {
//            return new ResponseEntity<>("Invalid vote value", HttpStatus.BAD_REQUEST);
//        }
//
//        if (vote.equals("yes")) {
//            if (voteEntity.getUsersVotedYes().contains(user)) {
//                return new ResponseEntity<>("User has already voted Yes", HttpStatus.BAD_REQUEST);
//            }
//            if (voteEntity.getUsersVotedNo().contains(user)) {
//                return new ResponseEntity<>("User has already voted No", HttpStatus.BAD_REQUEST);
//            }
//            voteEntity.getUsersVotedYes().add(user);
//            voteEntity.setYesCount(voteEntity.getYesCount() + 1);
//        } else { // vote.equals("no")
//            if (voteEntity.getUsersVotedNo().contains(user)) {
//                return new ResponseEntity<>("User has already voted No", HttpStatus.BAD_REQUEST);
//            }
//            if (voteEntity.getUsersVotedYes().contains(user)) {
//                return new ResponseEntity<>("User has already voted Yes", HttpStatus.BAD_REQUEST);
//            }
//            voteEntity.getUsersVotedNo().add(user);
//            voteEntity.setNoCount(voteEntity.getNoCount() + 1);
//        }
//
//        Vote updatedVote = voteRepository.save(voteEntity);
//
//        return new ResponseEntity<>(updatedVote, HttpStatus.OK);
//    }


    @GetMapping("/{voteId}")
    public ResponseEntity<?> getVoteDetails(@PathVariable Long voteId) {
        // Fetch the vote entity from the repository
        Optional<Vote> voteOptional = voteRepository.findById(voteId);

        if (!voteOptional.isPresent()) {
            return new ResponseEntity<>("Vote not found", HttpStatus.NOT_FOUND);
        }

        // Return the vote details along with OK status
        return new ResponseEntity<>(voteOptional.get(), HttpStatus.OK);
    }


    @GetMapping
    public List<Vote> getAllVotes() {
        return voteRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoteById(@PathVariable Long id) {
        try {
            voteRepository.deleteById(id);
            return ResponseEntity.ok("Vote deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete vote");
        }
    }
}
