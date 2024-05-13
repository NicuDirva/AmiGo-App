package com.license.AmiGo.service;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group_request;

import java.util.List;

public interface GroupRequestService {
    Group_request saveGroupRequest(Group_request groupRequest);
    List<Group_request> getAllGroupRequest();
}
