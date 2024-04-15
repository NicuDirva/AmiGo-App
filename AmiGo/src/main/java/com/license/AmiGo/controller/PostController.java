package com.license.AmiGo.controller;

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
    public List<Post> getAccountPost(@RequestParam("account_id") long accountId) {
        return postService.getAccountPost(accountId);
    }

    @GetMapping("/getPost")
    public Optional<Post> getPost(@RequestParam("post_id") long post_id) {
        return postService.getPost(post_id);
    }

    @PatchMapping("/addLike")
    public void addLikeToPost(@RequestBody Map<String, Long> request) {
        Long post_id = request.get("post_id");
        Long account_id = request.get("account_id");
        postService.addLikeToPost(post_id, account_id);
    }

}
