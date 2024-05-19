package com.license.AmiGo.repository;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group;
import com.license.AmiGo.model.Post;
import com.license.AmiGo.model.Profile;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends Neo4jRepository<Account, Long> {
    @Query("MATCH (a:Account)\n" +
            "MATCH (p:Profile)\n" +
            "WHERE id(a) = p.account_id AND p.account_id = $account_id\n" +
            "MERGE (a)-[:HAS_PROFILE]->(p)\n" +
            "MERGE (p)-[:HAS_ACCOUNT]->(a)")
    void createHasProfileRelationship(@Param("account_id") long account_id);

    @Query("MATCH (a1:Account)\n" +
            "MATCH (a2:Account)\n" +
            "WHERE id(a1) = $senderId AND id(a2) = $receiverId\n" +
            "MERGE (a1)-[:SEND_REQUEST]->(a2)")
    void createSendRequestRelationship(@Param("senderId") long senderId, @Param("receiverId") long receiverId);

    @Query("MATCH (a1:Account)\n" +
            "MATCH (a2:Account)\n" +
            "WHERE id(a1) = $senderId AND id(a2) = $receiverId\n" +
            "MERGE (a1)-[:FRIENDSHIP]->(a2\n)" +
            "MERGE (a2)-[:FRIENDSHIP]->(a1\n)")
    void createAcceptRequestRelationship(@Param("senderId") long senderId, @Param("receiverId") long receiverId);

    @Query("MATCH (a1:Account)-[r:SEND_REQUEST]->(a2:Account) " +
            "WHERE id(a1) = $senderId AND id(a2) = $receiverId " +
            "DELETE r")
    void deleteSendRequestRelationship(@Param("senderId") long senderId, @Param("receiverId") long receiverId);

    @Query("MATCH (a1:Account)-[r1:FRIENDSHIP]->(a2:Account) " +
            "MATCH (a2)-[r2:FRIENDSHIP]->(a1) " +
            "WHERE id(a1) = $accountId1 AND id(a2) = $accountId2 " +
            "DELETE r1, r2")
    void deleteFriendshipRelationship(@Param("accountId1") long senderId, @Param("accountId2") long receiverId);


    @Query("MATCH (a1:Account)-[:FRIENDSHIP]-(a2:Account)\n" +
            "WHERE id(a1) = $account_id\n" +
            "RETURN DISTINCT a2")
    List<Account> getFriendshipById(@Param("account_id") long account_id);


    @Query("MATCH (a1:Account)-[:SEND_REQUEST]->(a2:Account)\n" +
            "WHERE id(a1) = $account_id\n" +
            "RETURN DISTINCT a2")
    List<Account> getFriendRequestById(@Param("account_id") long account_id);


    @Query("MATCH (a1:Account)-[:SEND_REQUEST]->(a2:Account)\n" +
            "WHERE id(a2) = $account_id\n" +
            "RETURN DISTINCT a1")
    List<Account> FriendRequestReceivedById(@Param("account_id") long account_id);

    @Query("MATCH (p:Post)\n" +
            "MATCH (a:Account)\n" +
            "WHERE id(p) = $post_id AND id(a) = $authorId\n" +
            "MERGE (a)-[:LIKE]->(p\n)")
    void likePostRelationship(@Param("post_id") long post_id, @Param("authorId") long authorId);

    @Query("MATCH (a:Account)-[r:LIKE]->(p:Post)\n" +
            "WHERE id(a) = $account_id AND id(p) = $post_id\n" +
            "RETURN COUNT(r)")
    Integer checkLikePostRelationship(@Param("post_id") long post_id, @Param("account_id") long account_id);

    @Query("MATCH (a:Account)-[:LIKE]->(p:Post)\n" +
            "WHERE id(p) = $post_id\n" +
            "RETURN id(a)")
    List<Long> getLikeAccount (@Param("post_id") long post_id);
    @Query("MATCH (a:Account)-[r:LIKE]-(p:Post)\n" +
            "WHERE id(a) = $account_id AND id(p) = $post_id\n" +
            "DELETE r")
    void deleteLikePost(@Param("post_id") long post_id, @Param("account_id") long account_id);

    @Query("MATCH (p:Profile)\n" +
            "WHERE p.account_id = $account_id\n" +
            "RETURN id(p) as profile_id, p.location as location, p.access as access, p.account_id as account_id, p.img_url as img_url, p.description as description, p.gender as gender, p.dob as dob")
    Profile getProfileByAccountId(@Param("account_id") long account_id);

    @Query("MATCH (sender:Account), (receiver:Account)\n" +
            "WHERE id(sender) = $sender_id AND id(receiver) = $receiver_id\n" +
            "MERGE (sender)-[msg:SENT_MESSAGE]->(receiver)\n" +
            "SET msg.sender_id = $sender_id, msg.receiver_id = $receiver_id, msg.content = $content, msg.timeSent = $timeSent")
    void createMessage(@Param("sender_id") long sender_id, @Param("receiver_id") long receiver_id, @Param("content") String content, @Param("timeSent") String timeSent);


}
