package com.license.AmiGo.controller;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Post;
import com.license.AmiGo.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/post")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/add")
    public void add(@RequestBody Post post) {
        postService.savePost(post);
    }

    @GetMapping("/getAll")
    public List<Post> getAllPost() {
        return postService.getAllPost();
    }
    @GetMapping("/getAccountPost")
    public List<Post> getAccountPost(@RequestParam("account_id") long account_id) {
        return postService.getAccountPost(account_id);
    }

    @GetMapping("/getPostsByGroupId")
    public List<Post> getGroupPost(@RequestParam("group_id") long group_id) {
        return postService.getGroupPost(group_id);
    }

    @GetMapping("/getPost")
    public Optional<Post> getPost(@RequestParam("post_id") long post_id) {
        return postService.getPost(post_id);
    }

    @PatchMapping("/getLikeAccount")
    public List<Account> getLikeAccount(@RequestBody Post post) {
        return postService.getLikeAccount(post);
    }


    @PatchMapping("/HAS_POST")
    public void createPostedRelationship(@RequestBody Long account_id) {
        postService.createPostedRelationship(account_id);
    }
    @PostMapping("/DELETE_POST")
    public void deletePost(@RequestBody Long post_id) {
        postService.deletePost(post_id);
    }
    @PostMapping("/DELETE_POST_BY_GROUP_ID")
    public void deletePostByGroupId(@RequestBody Long group_id) {
         postService.deletePostByGroupId(group_id);
    }
    @PostMapping("/DELETE_POST_BY_ACCOUNT_ID")
    public void deletePostByAccountId(@RequestBody Long account_id) {
         postService.deletePostByAccountId(account_id);
    }

}
