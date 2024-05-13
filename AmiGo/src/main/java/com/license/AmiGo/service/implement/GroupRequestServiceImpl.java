package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group_request;
import com.license.AmiGo.repository.AccountRepository;
import com.license.AmiGo.repository.GroupRequestRepository;
import com.license.AmiGo.service.GroupRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupRequestServiceImpl implements GroupRequestService {
    @Autowired
    private GroupRequestRepository groupRequestRepository;
    @Override
    public Group_request saveGroupRequest(Group_request groupRequest) {
        return groupRequestRepository.save(groupRequest);
    }

    @Override
    public List<Group_request> getAllGroupRequest() {
        return groupRequestRepository.findAll();
    }
}
