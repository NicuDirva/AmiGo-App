package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Role;
import com.license.AmiGo.repository.AccountRepository;
import com.license.AmiGo.repository.RoleRepository;
import com.license.AmiGo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository roleRepository;
    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public List<Role> getAllRole() {
        return roleRepository.findAll();
    }
}
