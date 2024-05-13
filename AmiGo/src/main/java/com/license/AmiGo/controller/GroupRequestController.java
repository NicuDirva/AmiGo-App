package com.license.AmiGo.controller;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group_request;
import com.license.AmiGo.service.AccountService;
import com.license.AmiGo.service.GroupRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groupRequest")
@CrossOrigin
public class GroupRequestController {
    @Autowired
    private GroupRequestService groupRequestService;

    @PostMapping("/add")
    public void add(@RequestBody Group_request groupRequest) {
        groupRequestService.saveGroupRequest(groupRequest);
    }

    @GetMapping("/getAll")
    public List<Group_request> getAllGroupRequest() {
        return groupRequestService.getAllGroupRequest();
    }
}
