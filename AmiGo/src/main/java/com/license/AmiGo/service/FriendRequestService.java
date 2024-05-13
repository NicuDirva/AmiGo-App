package com.license.AmiGo.service;

import com.license.AmiGo.model.Friend_request;

import java.util.List;

public interface FriendRequestService {
    Friend_request saveFriendRequest(Friend_request friendRequest);
    void removeFriendRequest(Friend_request friendRequest);
    List<Friend_request> getAllFriendRequest();
}
