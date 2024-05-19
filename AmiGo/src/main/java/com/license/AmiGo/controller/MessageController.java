package com.license.AmiGo.controller;

import com.license.AmiGo.model.Group_request;
import com.license.AmiGo.model.Message;
import com.license.AmiGo.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/message")
@CrossOrigin
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("/add")
    public Message add(@RequestBody Message message) {
        return messageService.saveMessage(message);
    }

    @PatchMapping("/SENT_MESSAGE")
    public void createSentMessageRelationship(@RequestBody Map<String,Long> request) {
        Long account_id = request.get("account_id");
        Long message_id = request.get("message_id");
        messageService.createSentMessageRelationship(account_id, message_id);
    }

    @PatchMapping("/RECEIVED_MESSAGE")
    public void createReceivedMessageRelationship(@RequestBody Map<String,Long> request) {
        Long account_id = request.get("account_id");
        Long message_id = request.get("message_id");
        messageService.createReceivedMessageRelationship(account_id, message_id);
    }
    @PatchMapping("/getSentMessageByAccountId")
    public List<Message> getSentMessageByAccountId(@RequestBody Map<String, Long> request) {
        Long sender_id = request.get("sender_id");
        Long receiver_id = request.get("receiver_id");
        return messageService.getSentMessageByAccountId(sender_id, receiver_id);
    }

    @PatchMapping("/getReceivedMessageByAccountId")
    public List<Message> getReceivedMessageByAccountId(@RequestBody Map<String, Long> request) {
        Long receiver_id = request.get("receiver_id");
        Long sender_id = request.get("sender_id");
        return messageService.getReceivedMessageByAccountId(receiver_id, sender_id);
    }
    @PatchMapping("/getSentMessageById")
    public List<Message> getSentMessageById(@RequestBody Long sender_id) {
        return messageService.getSentMessageById(sender_id);
    }

    @PatchMapping("/getReceivedMessageById")
    public List<Message> getReceivedMessageById(@RequestBody Long receiver_id) {
        return messageService.getReceivedMessageById(receiver_id);
    }
}
