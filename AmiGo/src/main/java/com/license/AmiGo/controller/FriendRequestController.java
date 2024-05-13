package com.license.AmiGo.controller;

import com.license.AmiGo.model.Friend_request;
import com.license.AmiGo.model.Friendship;
import com.license.AmiGo.service.FriendRequestService;
import com.license.AmiGo.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friendRequest")
@CrossOrigin
public class FriendRequestController {
    @Autowired
    private FriendRequestService friendRequestService;

    @PostMapping("/add")
    public void add(@RequestBody Friend_request friendRequest) {
        friendRequestService.saveFriendRequest(friendRequest);
    }

    @DeleteMapping("/remove")
    public void remove(@RequestBody Friend_request friendRequest) {
        friendRequestService.removeFriendRequest(friendRequest);
    }

    @GetMapping("/getAll")
    public List<Friend_request> getAllFriendRequest() {
        return friendRequestService.getAllFriendRequest();
    }
}
