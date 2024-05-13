package com.license.AmiGo.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
public class Friendship {
    @Id@GeneratedValue
    private long friendshipId;
    private long accountId1;
    private long accountId2;

    public Friendship(long accountId1, long accountId2) {
        this.accountId1 = accountId1;
        this.accountId2 = accountId2;
    }
    public Friendship() {

    }

    public long getFriendshipId() {
        return friendshipId;
    }

    public void setFriendshipId(long friendshipId) {
        this.friendshipId = friendshipId;
    }

    public long getAccountId1() {
        return accountId1;
    }

    public void setAccountId1(long accountId1) {
        this.accountId1 = accountId1;
    }

    public long getAccountId2() {
        return accountId2;
    }

    public void setAccountId2(long accountId2) {
        this.accountId2 = accountId2;
    }
}
