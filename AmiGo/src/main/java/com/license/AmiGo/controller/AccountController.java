package com.license.AmiGo.controller;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account")
@CrossOrigin
public class AccountController {
    @Autowired
    private AccountService accountService;

    @PostMapping("/add")
    public String add(@RequestBody Account account) {
        accountService.saveAccount(account);
        return "Account added";
    }

    @GetMapping("/getAll")
    public List<Account> getAllPersons() {
        return accountService.getAllAccount();
    }
}
