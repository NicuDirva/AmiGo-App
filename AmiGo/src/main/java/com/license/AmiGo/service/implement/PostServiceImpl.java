package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Post;
import com.license.AmiGo.repository.PostRepository;
import com.license.AmiGo.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;
    @Override
    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public List<Post> getAllPost() {
        return postRepository.findAll();
    }
    @Override
    public List<Post> getAccountPost(long account_id) {
        return postRepository.getAllPost(account_id);
    }
    public List<Post> getGroupPost(long group_id) {
        return postRepository.getGroupPost(group_id);
    }

    public List<Account> getLikeAccount(Post post) {
        return postRepository.getLikeAccount(post);
    }

    @Override
    public Optional<Post> getPost(long post_id) {
        return postRepository.findById(post_id);
    }
    public void createPostedRelationship(long account_id) {
        postRepository.createPostedRelationship(account_id);
    }
    public void deletePost(long post_id) {
        postRepository.deletePost(post_id);
    }
}
