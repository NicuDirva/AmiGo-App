package com.license.AmiGo.repository;

import com.license.AmiGo.model.Post;
import com.license.AmiGo.model.Post_comment;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostCommentRepository extends Neo4jRepository<Post_comment, Long> {
    @Query("MATCH (p:Post)-[:HAS_COMMENT]->(c:Post_comment)\n" +
            "WHERE id(p) = $post_id\n" +
            "RETURN DISTINCT c")
    List<Post_comment> getAllPostCommentById(@Param("post_id") long post_id);

    @Query("MATCH (p:Post)\n" +
            "MATCH (c:Post_comment)\n" +
            "WHERE id(p) = c.post_id AND c.post_id = $post_id\n" +
            "MERGE (p)-[:HAS_COMMENT]->(c)\n" +
            "MERGE (c)-[:HAS_POST]->(p)")
    void createHasCommentRelationship(@Param("post_id") long post_id);

    @Query("MATCH (a:Account)\n" +
            "MATCH (c:Post_comment)\n" +
            "WHERE id(a) = c.account_id AND c.account_id = $account_id\n" +
            "MERGE (a)-[:HAS_COMMENT]->(c)\n" +
            "MERGE (c)-[:HAS_ACCOUNT]->(a)")
    void createHasPostRelationship(@Param("account_id") long account_id);
    @Query("MATCH (p:Post_comment)\n" +
            "WHERE id(p) = $post_id\n" +
            "DETACH DELETE p")
    void deleteComment(@Param("post_id") long post_id);

    @Query("MATCH (c:Post_comment)\n" +
            "WHERE c.post_id = $post_id\n" +
            "DETACH DELETE c")
    void deleteCommentByPostId(@Param("post_id") long post_id);
}
