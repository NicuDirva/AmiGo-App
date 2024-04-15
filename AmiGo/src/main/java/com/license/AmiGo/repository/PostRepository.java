package com.license.AmiGo.repository;

import com.license.AmiGo.model.Post;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends Neo4jRepository<Post, Long> {
    @Query("MATCH (p:Post) WHERE p.account_id = $account_id RETURN p")
    List<Post> getAllPost(@Param("account_id") long account_id);

}
