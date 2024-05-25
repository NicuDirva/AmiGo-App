package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Post_comment;
import com.license.AmiGo.repository.PostCommentRepository;
import com.license.AmiGo.service.PostCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostCommentServiceImpl implements PostCommentService {
    @Autowired
    private PostCommentRepository postCommentRepository;

    @Override
    public Post_comment savePostComment(Post_comment postComment) {
        return postCommentRepository.save(postComment);
    }

    @Override
    public List<Post_comment> getAllPostComment() {
        return postCommentRepository.findAll();
    }
    public List<Post_comment> getAllPostCommentById(long post_id) {
        return postCommentRepository.getAllPostCommentById(post_id);
    }

    public void createHasCommentRelationship(long post_id) {
        postCommentRepository.createHasCommentRelationship(post_id);
    }

    public void createHasPostRelationship(long account_id) {
        postCommentRepository.createHasPostRelationship(account_id);
    }
    public void deleteComment(long comment_id) {
        postCommentRepository.deleteComment(comment_id);
    }
    public void deleteCommentByPostId(long post_id) {
        postCommentRepository.deleteCommentByPostId(post_id);
    }
}
