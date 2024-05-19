package com.license.AmiGo.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
public class Message {
    @Id@GeneratedValue
    private long message_id;
    private long sender_id;
    private long receiver_id;
    private String content;
    private String timeSent;

    public Message(long message_id, long sender_id, long receiver_id, String content, String timeSent) {
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.content = content;
        this.timeSent = timeSent;
        this.message_id = message_id;
    }
    public Message(){}

    public long getMessage_id() {
        return message_id;
    }

    public void setMessage_id(long message_id) {
        this.message_id = message_id;
    }

    public long getSender_id() {
        return sender_id;
    }

    public void setSender_id(long sender_id) {
        this.sender_id = sender_id;
    }

    public long getReceiver_id() {
        return receiver_id;
    }

    public void setReceiver_id(long receiver_id) {
        this.receiver_id = receiver_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimeSent() {
        return timeSent;
    }

    public void setTimeSent(String timeSent) {
        this.timeSent = timeSent;
    }
}
