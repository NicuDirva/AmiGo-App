package com.license.AmiGo.repository;

import com.license.AmiGo.model.Place;
import com.license.AmiGo.model.Post;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PlaceRepository extends Neo4jRepository<Place, Long> {

    @Query("MATCH (p:Place) " +
            "WHERE $county CONTAINS p.county " +
            "RETURN p")
    List<Place> getPlaceByCounty(@Param("county") String county);

    @Query("MATCH (p:Place)\n" +
            "MATCH (po:Post)\n" +
            "WHERE id(po) = $post_id AND id(p) = $place_id\n" +
            "MERGE (po)-[:MENTIONED]->(p\n)")
    void createAccountVisitPlaceRelationship(@Param("post_id") long post_id, @Param("place_id") long place_id);

    @Query("MATCH (p:Place) \n" +
            "WHERE id(p) = $place_id\n" +
            "SET p.mentionsNumber = p.mentionsNumber + 1")
    void accountMentionedPlace(@Param("place_id") long place_id);

    @Query("MATCH (p:Post)-[r:MENTIONED]->(pl:Place) \n" +
            "WHERE id(p) = $post_id\n" +
            "RETURN pl")
    Place getPlaceByPostId(@Param("post_id") long post_id);
    @Query("MATCH (p:Place) \n" +
            "WHERE id(p) = $place_id\n" +
            "RETURN p")
    Place getPlaceByPlaceId(@Param("place_id") long place_id);

    @Query("MATCH (p:Post)-[r:MENTIONED]->(pl:Place)\n" +
            "WHERE id(pl) = $place_id\n" +
            "RETURN id(p) as post_id, p.account_id as account_id, p.group_id as group_id, p.urlImgPost as urlImgPost, p.contentPost as contentPost, p.post_date_created as post_date_created\n")
    List<Post> getPostByPlaceId(@Param("place_id") long place_id);
}
