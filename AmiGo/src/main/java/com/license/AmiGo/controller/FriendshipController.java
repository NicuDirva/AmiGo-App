package com.license.AmiGo.controller;


import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Friendship;
import com.license.AmiGo.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friendship")
@CrossOrigin
public class FriendshipController {
    @Autowired
    private FriendshipService friendshipService;

    @PostMapping("/add")
    public void add(@RequestBody Friendship friendship) {
        friendshipService.saveFriendship(friendship);
    }

    @DeleteMapping("/remove")
    public void remove(@RequestBody Friendship friendship) {
        friendshipService.removeFriendship(friendship);
    }

    @GetMapping("/getAll")
    public List<Friendship> getAllFriendship() {
        return friendshipService.getAllFriendship();
    }
}
