package com.license.AmiGo.service;

import com.license.AmiGo.model.Post_comment;

import java.util.List;

public interface PostCommentService {
    Post_comment savePostComment(Post_comment postComment);
    List<Post_comment> getAllPostComment();
    List<Post_comment> getAllPostCommentById(long post_id);

}
