package com.license.AmiGo.repository;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Role;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface RoleRepository extends Neo4jRepository<Role, Long> {
}
