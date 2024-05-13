package com.license.AmiGo.repository;

import com.license.AmiGo.model.Friendship;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface FriendshipRepository extends Neo4jRepository<Friendship, Long> {
}
