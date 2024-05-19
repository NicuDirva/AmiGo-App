package com.license.AmiGo.repository;

import com.license.AmiGo.model.Message;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MesssageRepository extends Neo4jRepository<Message, Long> {
    @Query("MATCH (a:Account)\n" +
            "MATCH (m:Message)\n" +
            "WHERE id(a) = $account_id AND id(m) = $message_id\n" +
            "MERGE (a)-[:SENT_MESSAGE]->(m\n)")
    void createSentMessageRelationship(@Param("account_id") long account_id, @Param("message_id") long message_id);
    @Query("MATCH (a:Account)\n" +
            "MATCH (m:Message)\n" +
            "WHERE id(a) = $account_id AND id(m) = $message_id\n" +
            "MERGE (a)-[:RECEIVED_MESSAGE]->(m\n)")
    void createReceivedMessageRelationship(@Param("account_id") long account_id, @Param("message_id") long message_id);

    @Query("MATCH (m:Message)\n" +
            "WHERE m.sender_id = $sender_id AND m.receiver_id = $receiver_id\n" +
            "RETURN m")
    List<Message> getSentMessageByAccountId(@Param("sender_id") long sender_id, @Param("receiver_id") long receiver_id);

    @Query("MATCH (m:Message)\n" +
            "WHERE m.sender_id = $sender_id AND m.receiver_id = $receiver_id\n" +
            "RETURN m")
    List<Message> getReceivedMessageByAccountId(@Param("receiver_id") long receiver_id, @Param("sender_id") long sender_id);

    @Query("MATCH (m:Message)\n" +
            "WHERE m.sender_id = $sender_id\n" +
            "RETURN m")
    List<Message> getSentMessageById(@Param("sender_id") long sender_id);

    @Query("MATCH (m:Message)\n" +
            "WHERE m.receiver_id = $receiver_id\n" +
            "RETURN m")
    List<Message> getReceivedMessageById(@Param("receiver_id") long receiver_id);
}
