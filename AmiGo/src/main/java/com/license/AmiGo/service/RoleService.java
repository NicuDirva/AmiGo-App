package com.license.AmiGo.service;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Role;

import java.util.List;

public interface RoleService {
    Role saveRole(Role role);
    List<Role> getAllRole();
}
