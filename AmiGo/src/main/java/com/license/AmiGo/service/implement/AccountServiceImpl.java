package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Message;
import com.license.AmiGo.model.Profile;
import com.license.AmiGo.repository.AccountRepository;
import com.license.AmiGo.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountRepository accountRepository;
    @Override
    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public List<Account> getAllAccount() {
        return accountRepository.findAll();
    }
    public void createHasProfileRelationship(Long account_id) {
        accountRepository.createHasProfileRelationship(account_id);
    }
    public void createSendRequestRelationship(Long senderId, Long receiverId) {
        accountRepository.createSendRequestRelationship(senderId, receiverId);
    }
    public void createAcceptRequestRelationship(Long senderId, Long receiverId) {
        accountRepository.createAcceptRequestRelationship(senderId, receiverId);
    }
    public void deleteSendRequestRelationship(Long senderId, Long receiverId) {
        accountRepository.deleteSendRequestRelationship(senderId, receiverId);
    }
    public void deleteFriendshipRelationship(Long accountId1, Long accountId2) {
        accountRepository.deleteFriendshipRelationship(accountId1, accountId2);
    }

    public List<Account> getFriendshipById(Long account_id) {
        return accountRepository.getFriendshipById(account_id);
    }

    public List<Account> getFriendRequestById(Long account_id) {
        return accountRepository.getFriendRequestById(account_id);
    }
    public List<Account> FriendRequestReceivedById(Long account_id) {
        return accountRepository.FriendRequestReceivedById(account_id);
    }
    public void likePostRelationship(Long post_id, Long authorId) {
        accountRepository.likePostRelationship(post_id, authorId);
    }

    public Integer checkLikePostRelationship(Long post_id, Long account_id) {
        return accountRepository.checkLikePostRelationship(post_id, account_id);
    }
    public List<Long> getLikeAccount(long post_id) {
        return accountRepository.getLikeAccount(post_id);
    }
    public void deleteLikePost(long post_id, long account_id) {
        accountRepository.deleteLikePost(post_id, account_id);
    }
    public Profile getProfileByAccountId(long account_id) {
        return accountRepository.getProfileByAccountId(account_id);
    }
    public void createMessage(long sender_id, long receiver_id, String content, String timeSent) {
        accountRepository.createMessage(sender_id, receiver_id, content, timeSent);
    }
}
