package com.license.AmiGo.repository;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupRepository extends Neo4jRepository<Group, Long> {
    @Query("MATCH (a:Account)\n" +
            "MATCH (g:Group)\n" +
            "WHERE id(a) = $creator_id AND id(g) = $group_id\n" +
            "MERGE (a)-[:CREATE]->(g)")
    void createGroupRelationship(@Param("creator_id") long creator_id, @Param("group_id") long group_id);
    @Query("MATCH (a:Account)-[r:CREATE]->(g:Group)\n" +
            "WHERE id(a) = $creator_id AND id(g) = $group_id\n" +
            "DELETE r")
    void deleteCreateGroupRelationship(@Param("creator_id") long creator_id, @Param("group_id") long group_id);

    @Query("MATCH (a:Account)\n" +
            "MATCH (g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "MERGE (a)-[:MEMBERSHIP]->(g)")
    void createMembershipRelationship(@Param("account_id") long account_id, @Param("group_id") long group_id);
    @Query("MATCH (a:Account)\n" +
            "MATCH (g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "MERGE (a)-[:REQUEST_JOIN]->(g)")
    void createRequestMembershipRelationship(@Param("account_id") long account_id, @Param("group_id") long group_id);

    @Query("MATCH (a:Account)-[r:MEMBERSHIP]->(g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "DELETE r")
    void deleteMembershipRelationship(@Param("account_id") long account_id, @Param("group_id") long group_id);

    @Query("MATCH (a:Account)-[r:REQUEST_JOIN]->(g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "DELETE r")
    void deleteRequestMembershipRelationship(@Param("account_id") long account_id, @Param("group_id") long group_id);

    @Query("MATCH (g:Group)\n" +
            "WHERE g.creator_id = $creator_id\n" +
            "RETURN g")
    Group getGroupByCreatorId(@Param("creator_id") long creator_id);
    @Query("MATCH (a:Account)-[:MEMBERSHIP]->(g:Group)\n" +
            "WHERE id(g) = $group_id\n" +
            "RETURN id(a) as account_id, a.account_date_created as account_date_created, a.password as password, a.username as username, a.email as email")
    List<Account> getMembersByGroupId(@Param("group_id") long group_id);

    @Query("MATCH(n:Group)" +
            "WHERE id(n) = $group_id\n" +
            "DETACH DELETE n")
    void deleteByGroupId(@Param("group_id") long group_id);


    @Query("MATCH (a:Account)-[:ADMIN]->(g:Group)\n" +
            "WHERE id(g) = $group_id\n" +
            "RETURN id(a) as account_id, a.account_date_created as account_date_created, a.password as password, a.username as username, a.email as email")
    List<Account> getAdminByGroupId(@Param("group_id") long group_id);

    @Query("MATCH (a:Account)-[:MEMBERSHIP]->(g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "RETURN COUNT(a)")
    Long checkMembershipByAccountId(@Param("account_id") long account_id, @Param("group_id") long group_id);
    @Query("MATCH (a:Account)-[:REQUEST_JOIN]->(g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "RETURN COUNT(a)")
    Long checkRequestMemberByAccountId(@Param("account_id") long account_id, @Param("group_id") long group_id);
    @Query("MATCH (a:Account)-[:CREATE]->(g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "RETURN COUNT(a)")
    Long checkOwnerGroupByAccountId(@Param("account_id") long account_id, @Param("group_id") long group_id);
    @Query("MATCH (a:Account)-[:ADMIN]->(g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "RETURN COUNT(a)")
    Long checkAdminGroupByAccountId(@Param("account_id") long account_id, @Param("group_id") long group_id);

    @Query("MATCH (a1:Account)-[:MEMBERSHIP]->(g:Group)<-[:MEMBERSHIP]-(a:Account) " +
            "WHERE id(a1) = $account_id AND id(a) <> $account_id " +
            "RETURN DISTINCT id(a) as account_id, a.account_date_created as account_date_created, a.password as password, a.username as username, a.email as email")
    List<Account> getCommonMembersGroupByAccountId(@Param("account_id") long account_id);
    @Query("MATCH (a:Account)-[:MEMBERSHIP]->(g:Group)\n" +
            "WHERE id(a) = $account_id\n" +
            "RETURN g")
    List<Group> getAllMemberGroupByAccountId(@Param("account_id") long account_id);

    @Query("MATCH (a:Account)\n" +
            "MATCH (g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "MERGE (a)-[:ADMIN]->(g)")
    void createAdminRelationship(@Param("account_id") long account_id, @Param("group_id") long group_id);

    @Query("MATCH (a:Account)-[r:ADMIN]->(g:Group)\n" +
            "WHERE id(a) = $account_id AND id(g) = $group_id\n" +
            "DELETE r")
    void deleteAdminRelationship(@Param("account_id") long account_id, @Param("group_id") long group_id);

    @Query("MATCH (g:Group)\n" +
            "WHERE id(g) = $group_id\n" +
            "RETURN g")
    Group getGroupById(@Param("group_id") long group_id);

    @Query("MATCH (a:Account)-[:REQUEST_JOIN]->(g:Group)\n" +
            "WHERE id(g) = $group_id\n" +
            "RETURN id(a) as account_id, a.account_date_created as account_date_created, a.password as password, a.username as username, a.email as email")
    List<Account> getMembersRequestByGroupId(@Param("group_id") long group_id);


}
