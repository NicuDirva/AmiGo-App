package com.license.AmiGo.repository;

import com.license.AmiGo.model.Post;
import com.license.AmiGo.model.Post_comment;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostCommentRepository extends Neo4jRepository<Post_comment, Long> {
    @Query("MATCH (c:Post_comment) WHERE c.post_id = $post_id RETURN c")
    List<Post_comment> getAllPostCommentById(@Param("post_id") long post_id);
}
