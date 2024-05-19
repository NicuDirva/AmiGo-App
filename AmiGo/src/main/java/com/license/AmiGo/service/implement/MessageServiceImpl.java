package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Message;
import com.license.AmiGo.repository.MesssageRepository;
import com.license.AmiGo.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {
    @Autowired
    private MesssageRepository messageRepository;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }
    public void createSentMessageRelationship(long accont_id, long message_id) {
        messageRepository.createSentMessageRelationship(accont_id, message_id);
    }
    public void createReceivedMessageRelationship(long accont_id, long message_id) {
        messageRepository.createReceivedMessageRelationship(accont_id, message_id);
    }
    public List<Message> getSentMessageByAccountId(long sender_id, long receiver_id) {
        return messageRepository.getSentMessageByAccountId(sender_id, receiver_id);
    }
    public List<Message> getReceivedMessageByAccountId(long receiver_id, long sender_id) {
        return messageRepository.getReceivedMessageByAccountId(receiver_id, sender_id);
    }
    public List<Message> getSentMessageById(long sender_id) {
        return messageRepository.getSentMessageById(sender_id);
    }
    public List<Message> getReceivedMessageById(long receiver_id) {
        return messageRepository.getReceivedMessageById(receiver_id);
    }
}
