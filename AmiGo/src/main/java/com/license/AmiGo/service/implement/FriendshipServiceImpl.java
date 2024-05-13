package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Friendship;
import com.license.AmiGo.repository.AccountRepository;
import com.license.AmiGo.repository.FriendshipRepository;
import com.license.AmiGo.service.FriendshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendshipServiceImpl implements FriendshipService {
    @Autowired
    private FriendshipRepository friendshipRepository;
    @Override
    public Friendship saveFriendship(Friendship friendship) {
        return friendshipRepository.save(friendship);
    }

    @Override
    public void removeFriendship(Friendship friendship) {
         friendshipRepository.delete(friendship);
    }

    @Override
    public List<Friendship> getAllFriendship() {
        return friendshipRepository.findAll();
    }
}
