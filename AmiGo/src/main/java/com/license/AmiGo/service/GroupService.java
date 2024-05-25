package com.license.AmiGo.service;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Group;
import com.license.AmiGo.model.Profile;

import java.util.List;

public interface GroupService {
    Group saveGroup(Group group);
    List<Group> getAllGroup();
    void createGroupRelationship(long creator_id, long group_id);
    void deleteCreateGroupRelationship(long creator_id, long group_id);
    void createMembershipRelationship(long account_id, long group_id);
    void createRequestMembershipRelationship(long account_id, long group_id);
    void deleteMembershipRelationship(long account_id, long group_id);
    void deleteRequestMembershipRelationship(long account_id, long group_id);
    List<Group> getGroupByCreatorId(long creator_id);
    List<Account> getMembersByGroupId(long group_id);
    List<Account> getAdminByGroupId(long group_id);
    void deleteByGroupId(long group_id);
    Long checkMembershipByAccountId(long account_id, long group_id);
    Long checkRequestMemberByAccountId(long account_id, long group_id);
    Long checkOwnerGroupByAccountId(long account_id, long group_id);
    Long checkAdminGroupByAccountId(long account_id, long group_id);
    List<Group> getAllMemberGroupByAccountId(long account_id);
    void createAdminRelationship(long account_id, long group_id);
    void deleteAdminRelationship(long account_id, long group_id);
    void editGroup(Group group);
    Group getGroupById(long group_id);
    List<Account> getMembersRequestByGroupId(long group_id);
    List<Account> getCommonMembersGroupByAccountId(long account_id);
    void editGroupCreator(Group group);
}
