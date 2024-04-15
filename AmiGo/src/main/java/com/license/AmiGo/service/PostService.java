package com.license.AmiGo.service;

import com.license.AmiGo.model.Post;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface PostService {
    Post savePost(Post post);
    List<Post> getAllPost();
    Optional<Post> getPost(long post_id);
    List<Post> getAccountPost(long account_id);
    void addLikeToPost(long post_id, Long account_id);
}
