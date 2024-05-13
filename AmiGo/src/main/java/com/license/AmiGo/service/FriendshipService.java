package com.license.AmiGo.service;

import com.license.AmiGo.model.Friendship;

import java.util.List;

public interface FriendshipService {
    Friendship saveFriendship(Friendship friendship);
    void removeFriendship(Friendship friendship);
    List<Friendship> getAllFriendship();
}
