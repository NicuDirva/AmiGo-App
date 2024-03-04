package com.license.AmiGo.repository;

import com.license.AmiGo.model.Profile;
import org.springframework.data.neo4j.repository.Neo4jRepository;

public interface ProfileRepository extends Neo4jRepository<Profile, Long> {
}
