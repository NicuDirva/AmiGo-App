package com.license.AmiGo.controller;

import com.license.AmiGo.model.*;
import com.license.AmiGo.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/account")
@CrossOrigin
public class AccountController {
    @Autowired
    private AccountService accountService;

    @PostMapping("/add")
    public String add(@RequestBody Account account) {
        accountService.saveAccount(account);
        return "Account added";
    }

    @GetMapping("/getAll")
    public List<Account> getAllAccount() {
        return accountService.getAllAccount();
    }

    @PatchMapping("/HAS_PROFILE")
    public void createHasProfileRelationship(@RequestBody Long account) {
        accountService.createHasProfileRelationship(account);
    }

    @PatchMapping("/SEND_REQUEST")
    public void createSendRequestRelationship(@RequestBody Map<String, Long> request) {
        Long senderId = request.get("senderId");
        Long receiverId = request.get("receiverId");
        accountService.createSendRequestRelationship(senderId, receiverId);
    }

    @PatchMapping("/FRIENDSHIP")
    public void createAcceptRequestRelationship(@RequestBody Map<String, Long> request) {
        Long senderId = request.get("senderId");
        Long receiverId = request.get("receiverId");
        accountService.createAcceptRequestRelationship(senderId, receiverId);
    }

    @PatchMapping("/DELETE_SEND_REQUEST")
    public void deleteSendRequestRelationship(@RequestBody Map<String, Long> request) {
        Long senderId = request.get("senderId");
        Long receiverId = request.get("receiverId");
        accountService.deleteSendRequestRelationship(senderId, receiverId);
    }


    @PatchMapping("/DELETE_FRIENDSHIP")
    public void deleteFriendshipRelationship(@RequestBody Map<String, Long> request) {
        Long accountId1 = request.get("accountId1");
        Long accountId2 = request.get("accountId2");
        accountService.deleteFriendshipRelationship(accountId1, accountId2);
    }

    @PostMapping("/getFriendshipById")
    public List<Account> getFriendshipById(@RequestBody Long account_id) {
        return accountService.getFriendshipById(account_id);
    }

    @PostMapping("/getFriendRequestById")
    public List<Account> getFriendRequestById(@RequestBody Long account_id) {
        return accountService.getFriendRequestById(account_id);
    }

    @PostMapping("/FriendRequestReceivedById")
    public List<Account> FriendRequestReceivedById(@RequestBody Long account_id) {
        return accountService.FriendRequestReceivedById(account_id);
    }

    @PatchMapping("/LIKE_POST")
    public void likePostRelationship(@RequestBody Map<String,Long> request) {
        Long post_id = request.get("post_id");
        Long authorId = request.get("authorId");
        accountService.likePostRelationship(post_id, authorId);
    }

    @PatchMapping("/CHECK_LIKE_POST")
    public Integer checkLikePostRelationship(@RequestBody Map<String,Long> request) {
        Long post_id = request.get("post_id");
        Long account_id = request.get("account_id");
        return accountService.checkLikePostRelationship(post_id, account_id);
    }

    @PatchMapping("/getLikeAccount")
    public List<Long> getLikeAccount(@RequestBody Long post_id) {
        return accountService.getLikeAccount(post_id);
    }

    @PatchMapping("/DELETE_LIKE")
    public void deleteLikePost(@RequestBody Map<String, Long> request) {
        Long post_id = request.get("post_id");
        Long account_id = request.get("account_id");
        accountService.deleteLikePost(post_id, account_id);
    }

    @PostMapping("/getProfileByAccountId")
    public Profile getProfileByAccountId(@RequestBody Long account_id) {
        return accountService.getProfileByAccountId(account_id);
    }

    @PostMapping("/SENT_MESSAGE")
    public void createMessage(@RequestBody Map<String, Object> message) {
        Integer sender_id = (Integer) message.get("sender_id");
        Integer receiver_id = (Integer) message.get("receiver_id");
        String content = (String) message.get("content");
        String timeSent = (String) message.get("timeSent");
        accountService.createMessage(sender_id, receiver_id, content, timeSent);
    }

    @PatchMapping("/getCommonFriendBy2AccountId")
    public List<Account> getCommonFriendBy2AccountId(@RequestBody Map<String, Long> request) {
        Long accountId1 = request.get("accountId1");
        Long accountId2 = request.get("accountId2");
        return accountService.getCommonFriendBy2AccountId(accountId1, accountId2);
    }

    @PatchMapping("/deleteAccountById")
    public void deleteAccountById(@RequestBody Long account_id) {
        accountService.deleteAccountById(account_id);
    }
}
