package com.license.AmiGo.service;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Post;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface PostService {
    Post savePost(Post post);
    List<Post> getAllPost();
    Optional<Post> getPost(long post_id);
    List<Post> getAccountPost(long account_id);
    List<Post> getGroupPost(long group_id);
    List<Account> getLikeAccount(Post post);
    void createPostedRelationship(long account_id);
    void deletePost(long post_id);
    void deletePostByGroupId(long group_id);
    void deletePostByAccountId(long account_id);
}
