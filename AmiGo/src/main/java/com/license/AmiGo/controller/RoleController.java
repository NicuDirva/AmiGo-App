package com.license.AmiGo.controller;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Role;
import com.license.AmiGo.service.AccountService;
import com.license.AmiGo.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
@CrossOrigin
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping("/add")
    public void add(@RequestBody Role role) {
        roleService.saveRole(role);
    }

    @GetMapping("/getAll")
    public List<Role> getAllRole() {
        return roleService.getAllRole();
    }
}
