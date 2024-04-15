package com.license.AmiGo.repository;

import com.license.AmiGo.model.Profile;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

public interface ProfileRepository extends Neo4jRepository<Profile, Long> {

    @Query("MATCH (p:Profile) WHERE p.account_id = $account_id RETURN p.img_url")
    String getAvatar(@Param("account_id") long account_id);
}
