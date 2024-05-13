package com.license.AmiGo.repository;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group_request;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface GroupRequestRepository extends Neo4jRepository<Group_request, Long> {
}
