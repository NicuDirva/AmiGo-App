package com.license.AmiGo.controller;

import com.license.AmiGo.model.Post;
import com.license.AmiGo.repository.PostRepository;
import com.license.AmiGo.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
@CrossOrigin
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/add")
    public void add(@RequestBody Post post) {
        postService.savePost(post);
    }

    @PostMapping("getAll")
    public List<Post> getAllPost() {
        return postService.getAllPost();
    }
}
