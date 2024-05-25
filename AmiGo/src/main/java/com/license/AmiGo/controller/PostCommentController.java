package com.license.AmiGo.controller;

import com.license.AmiGo.model.Post_comment;
import com.license.AmiGo.service.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
@CrossOrigin(origins = "http://localhost:3000")
public class PostCommentController {
    @Autowired
    private PostCommentService postCommentService;

    @PostMapping("/add")
    public void add(@RequestBody Post_comment postComment) {
        postCommentService.savePostComment(postComment);
    }
    @GetMapping("/getAll")
    public List<Post_comment> getAllPostComment() {
        return postCommentService.getAllPostComment();
    }

    @GetMapping("/getAllPostCommentById")
    public List<Post_comment> getAllPostComment(@RequestParam("post_id") long post_id) {
        return postCommentService.getAllPostCommentById(post_id);
    }

    @PatchMapping("/HAS_COMMENT")
    public void createHasCommentRelationship(@RequestBody Long post_id) {
        postCommentService.createHasCommentRelationship(post_id);
    }

    @PatchMapping("/HAS_POST")
    public void createHasPostRelationship(@RequestBody Long account_id) {
        postCommentService.createHasPostRelationship(account_id);
    }
    @PostMapping("/DELETE_COMMENT")
    public void deleteComment(@RequestBody Long comment_id) {
        postCommentService.deleteComment(comment_id);
    }
    @PostMapping("/DELETE_COMMENT_BY_POST_ID")
    public void deleteCommentByPostId(@RequestBody Long post_id) {
        postCommentService.deleteCommentByPostId(post_id);
    }
}
