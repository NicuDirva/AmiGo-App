package com.license.AmiGo.controller;

import com.license.AmiGo.model.Post_comment;
import com.license.AmiGo.service.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/postComment")
@CrossOrigin
public class PostCommentController {
    @Autowired
    private PostCommentService postCommentService;

    @PostMapping("/add")
    public void add(@RequestBody Post_comment postComment) {

        postCommentService.savePostComment(postComment);
    }
    @PostMapping("getAll")
    public List<Post_comment> getAllPostComment() {

        return postCommentService.getAllPostComment();
    }
}
