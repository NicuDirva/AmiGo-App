package com.license.AmiGo.repository;

import com.license.AmiGo.model.Profile;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

public interface ProfileRepository extends Neo4jRepository<Profile, Long> {

    @Query("MATCH (p:Profile) WHERE p.account_id = $account_id RETURN p.img_url")
    String getAvatar(@Param("account_id") long account_id);

    @Query("MATCH (p:Profile)\n" +
            "WHERE id(p) = $profile_id\n" +
            "RETURN id(p) as profile_id, p.location as location, p.access as access, p.account_id as account_id, p.img_url as img_url, p.description as description, p.gender as gender, p.dob as dob")
    Profile getProfileById(@Param("profile_id") long profile_id);

    @Query("MATCH (p:Profile)\n" +
            "WHERE p.account_id = $account_id\n" +
            "DETACH DELETE p")
    void deleteProfileByAccountId(@Param("account_id") long account_id);
}
