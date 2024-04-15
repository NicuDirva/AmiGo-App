package com.license.AmiGo.service.implement;

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

    @Override
    public void addLikeToPost(long post_id, Long account_id) {
        Optional<Post> postOptional = postRepository.findById(post_id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.getLikePostArray().add(account_id);
            postRepository.save(post);
        } else {
            throw new IllegalArgumentException("Post not found with id: " + post_id);
        }
    }

    @Override
    public Optional<Post> getPost(long post_id) {
        return postRepository.findById(post_id);
    }
}
