package com.license.AmiGo.model;

import com.license.AmiGo.repository.FriendRequestRepository;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
public class Friend_request {

    @Id@GeneratedValue
    private long friendRequestId;
    private long senderId;
    private long receiverId;

    public Friend_request(long senderId, long receiverId) {
        this.senderId = senderId;
        this.receiverId = receiverId;
    }
    public Friend_request() {

    }

    public long getFriendRequestId() {
        return friendRequestId;
    }

    public void setFriendRequestId(long friendRequestId) {
        this.friendRequestId = friendRequestId;
    }

    public long getSenderId() {
        return senderId;
    }

    public void setSenderId(long senderId) {
        this.senderId = senderId;
    }

    public long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(long receiverId) {
        this.receiverId = receiverId;
    }
}
