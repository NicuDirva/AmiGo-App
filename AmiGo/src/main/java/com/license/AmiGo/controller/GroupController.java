package com.license.AmiGo.controller;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group;
import com.license.AmiGo.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/group")
@CrossOrigin
public class GroupController {
    @Autowired
    private GroupService groupService;

    @PostMapping("/add")
    public Group add(@RequestBody Group group) {
        return groupService.saveGroup(group);
    }

    @GetMapping("/getAll")
    public List<Group> getAllGroup() {
        return groupService.getAllGroup();
    }
    @PatchMapping("/CREATE")
    public void createGroupRelationship(@RequestBody Long creator_id){
        groupService.createGroupRelationship(creator_id);
    }
    @PatchMapping("/MEMBERSHIP")
    public void createMembershipRelationship(@RequestBody Map<String, Long> request){
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        groupService.createMembershipRelationship(account_id, group_id);
    }
    @PatchMapping("/MEMBERSHIP_REQUEST")
    public void createRequestMembershipRelationship(@RequestBody Map<String, Long> request){
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        groupService.createRequestMembershipRelationship(account_id, group_id);
    }
    @PatchMapping("/DELETE_MEMBERSHIP")
    public void deleteMembershipRelationship(@RequestBody Map<String, Long> request){
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        groupService.deleteMembershipRelationship(account_id, group_id);
    }
    @PatchMapping("/ADMIN")
    public void createAdminRelationship(@RequestBody Map<String, Long> request){
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        groupService.createAdminRelationship(account_id, group_id);
    }
    @PatchMapping("/DELETE_ADMIN")
    public void deleteAdminRelationship(@RequestBody Map<String, Long> request){
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        groupService.deleteAdminRelationship(account_id, group_id);
    }
    @PatchMapping("/DELETE_MEMBERSHIP_REQUEST")
    public void deleteRequestMembershipRelationship(@RequestBody Map<String, Long> request){
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        groupService.deleteRequestMembershipRelationship(account_id, group_id);
    }
    @PostMapping("/getGroupByCreatorId")
    public Group getGroupByCreatorId(@RequestBody Long creator_id) {
        return groupService.getGroupByCreatorId(creator_id);
    }
    @PostMapping("/getMembersByGroupId")
    public List<Account> getMembersByGroupId(@RequestBody Long group_id) {
        return groupService.getMembersByGroupId(group_id);
    }
    @PostMapping("/checkMembershipByAccountId")
    public Long checkMembershipByAccountId(@RequestBody Map<String, Long>  request) {
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        return groupService.checkMembershipByAccountId(account_id, group_id);
    }
    @PostMapping("/checkRequestJoinByAccountId")
    public Long checkRequestMemberByAccountId(@RequestBody Map<String, Long>  request) {
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        return groupService.checkRequestMemberByAccountId(account_id, group_id);
    }
    @PostMapping("/checkOwnerGroupByAccountId")
    public Long checkOwnerGroupByAccountId(@RequestBody Map<String, Long>  request) {
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        return groupService.checkOwnerGroupByAccountId(account_id, group_id);
    }

    @PostMapping("/checkAdminGroupByAccountId")
    public Long checkAdminGroupByAccountId(@RequestBody Map<String, Long>  request) {
        Long account_id = request.get("account_id");
        Long group_id = request.get("group_id");
        return groupService.checkAdminGroupByAccountId(account_id, group_id);
    }
    @PostMapping("/getAllMemberGroupByAccountId")
    public List<Group> getAllMemberGroupByAccountId(@RequestBody Long account_id) {
        return groupService.getAllMemberGroupByAccountId(account_id);
    }
}
