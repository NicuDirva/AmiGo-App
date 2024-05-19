package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group;
import com.license.AmiGo.model.Profile;
import com.license.AmiGo.repository.GroupRepository;
import com.license.AmiGo.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupServiceImpl implements GroupService {
    @Autowired
    private GroupRepository groupRepository;
    @Override
    public Group saveGroup(Group group) {
        return groupRepository.save(group); // Presupunând că getId() returnează id-ul grupului
    }

    @Override
    public List<Group> getAllGroup() {
        return groupRepository.findAll();
    }
    public void createGroupRelationship(long creator_id, long group_id) {
        groupRepository.createGroupRelationship(creator_id, group_id);
    }
    public void deleteCreateGroupRelationship(long creator_id, long group_id) {
        groupRepository.deleteCreateGroupRelationship(creator_id, group_id);
    }
    public void createMembershipRelationship(long account_id, long group_id) {
        groupRepository.createMembershipRelationship(account_id, group_id);
    }
    public void deleteMembershipRelationship(long account_id, long group_id) {
        groupRepository.deleteMembershipRelationship(account_id, group_id);
    }
    public void createRequestMembershipRelationship(long account_id, long group_id) {
        groupRepository.createRequestMembershipRelationship(account_id, group_id);
    }
    public void deleteRequestMembershipRelationship(long account_id, long group_id) {
        groupRepository.deleteRequestMembershipRelationship(account_id, group_id);
    }
    public Group getGroupByCreatorId(long creator_id) {
        return groupRepository.getGroupByCreatorId(creator_id);
    }
    public List<Account> getMembersByGroupId(long group_id) {
        return groupRepository.getMembersByGroupId(group_id);
    }
    public void deleteByGroupId(long group_id) {
        groupRepository.deleteByGroupId(group_id);
    }
    public List<Account> getAdminByGroupId(long group_id) {
        return groupRepository.getAdminByGroupId(group_id);
    }
    public Long checkMembershipByAccountId(long account_id, long group_id) {
        return groupRepository.checkMembershipByAccountId(account_id, group_id);
    }
    public Long checkRequestMemberByAccountId(long account_id, long group_id) {
        return groupRepository.checkRequestMemberByAccountId(account_id, group_id);
    }
    public Long checkOwnerGroupByAccountId(long account_id, long group_id) {
        return groupRepository.checkOwnerGroupByAccountId(account_id, group_id);
    }
    public Long checkAdminGroupByAccountId(long account_id, long group_id) {
        return groupRepository.checkAdminGroupByAccountId(account_id, group_id);
    }
    public List<Group> getAllMemberGroupByAccountId(long account_id) {
        return groupRepository.getAllMemberGroupByAccountId(account_id);
    }

    public void createAdminRelationship(long account_id, long group_id) {
        groupRepository.createAdminRelationship(account_id, group_id);
    }
    public void deleteAdminRelationship(long account_id, long group_id) {
        groupRepository.deleteAdminRelationship(account_id, group_id);
    }
    public void editGroup(Group group) {
        Group existingGroup = groupRepository.findById(group.getGroup_id())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existingGroup.setName(group.getName());
        existingGroup.setAccess(group.getAccess());
        existingGroup.setUrlImg(group.getUrlImg());

        groupRepository.save(existingGroup);
    }
    public Group getGroupById(long group_id) {
        return groupRepository.getGroupById(group_id);
    }
    public List<Account> getMembersRequestByGroupId(long group_id) {
        return groupRepository.getMembersRequestByGroupId(group_id);
    }

    public void editGroupCreator(Group group) {
        Group existingGroup = groupRepository.findById(group.getGroup_id())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        existingGroup.setCreator_id(group.getCreator_id());

        groupRepository.save(existingGroup);
    }
    public List<Account> getCommonMembersGroupByAccountId(long account_id) {
        return groupRepository.getCommonMembersGroupByAccountId(account_id);
    }
}
