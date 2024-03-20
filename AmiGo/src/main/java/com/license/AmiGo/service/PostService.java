package com.license.AmiGo.service;

import com.license.AmiGo.model.Post;

import java.util.List;

public interface PostService {
    Post savePost(Post post);
    List<Post> getAllPost();
}
