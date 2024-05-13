package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Friend_request;
import com.license.AmiGo.model.Friendship;
import com.license.AmiGo.repository.AccountRepository;
import com.license.AmiGo.repository.FriendRequestRepository;
import com.license.AmiGo.service.FriendRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendRequestServiceImpl implements FriendRequestService{
    @Autowired
    private FriendRequestRepository friendRequestRepository;
    @Override
    public Friend_request saveFriendRequest(Friend_request friendRequest) {
        return friendRequestRepository.save(friendRequest);
    }

    @Override
    public void removeFriendRequest(Friend_request friendRequest) {
        friendRequestRepository.delete(friendRequest);
    }

    @Override
    public List<Friend_request> getAllFriendRequest() {
        return friendRequestRepository.findAll();
    }
}
