package com.license.AmiGo.service;

import com.license.AmiGo.model.Message;

import java.util.List;

public interface MessageService {
    Message saveMessage(Message message);

    void createSentMessageRelationship(long accont_id, long message_id);
    void createReceivedMessageRelationship(long accont_id, long message_id);
    List<Message> getSentMessageByAccountId(long sender_id, long receiver_id);
    List<Message> getReceivedMessageByAccountId(long receiver_id, long sender_id);
    List<Message> getSentMessageById(long sender_id);
    List<Message> getReceivedMessageById(long receiver_id);
    void deleteAllMessagesByAccountId(long account_id);
}
