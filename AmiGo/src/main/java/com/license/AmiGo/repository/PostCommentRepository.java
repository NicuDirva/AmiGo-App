package com.license.AmiGo.repository;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Post_comment;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface PostCommentRepository extends Neo4jRepository<Post_comment, Long> {
}
