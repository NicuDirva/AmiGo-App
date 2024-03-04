package com.license.AmiGo.repository;

import com.license.AmiGo.model.Account;
import org.springframework.data.neo4j.repository.Neo4jRepository;

import java.util.Optional;

public interface AccountRepository extends Neo4jRepository<Account, Long> {
}
