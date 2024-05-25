package com.license.AmiGo.service;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Message;
import com.license.AmiGo.model.Profile;

import java.util.List;

public interface AccountService {
    Account saveAccount(Account account);
    List<Account> getAllAccount();
    void createHasProfileRelationship(Long accound_id);
    void createSendRequestRelationship(Long senderId, Long receiverId);
    void createAcceptRequestRelationship(Long senderId, Long receiverId);
    void deleteSendRequestRelationship(Long senderId, Long receiverId);
    void deleteFriendshipRelationship(Long accoundId1, Long accountId2);
    List<Account> getFriendshipById(Long account_id);

    List<Account> getFriendRequestById(Long account_id);
    List<Account> FriendRequestReceivedById(Long account_id);
    void likePostRelationship(Long post_id, Long authorId);
    Integer checkLikePostRelationship(Long post_id, Long account_id);
    List<Long> getLikeAccount(long post_id);
    void deleteLikePost(long account_id, long post_id);
    Profile getProfileByAccountId(long account_id);
    void createMessage(long sender_id, long receiver_id, String content, String timeSent);
    List<Account> getCommonFriendBy2AccountId(long accountId1, long accountId2);

    void deleteAccountById(long account_id);

}
