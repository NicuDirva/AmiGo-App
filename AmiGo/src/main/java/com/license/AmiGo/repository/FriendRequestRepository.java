package com.license.AmiGo.repository;

import com.license.AmiGo.model.Friend_request;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface FriendRequestRepository extends Neo4jRepository<Friend_request, Long> {
}
