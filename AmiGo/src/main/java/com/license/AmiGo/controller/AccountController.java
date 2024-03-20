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
        System.out.printf("Email " + account.getEmail() + "Id " + account.getAccount_id());
        return "Account added";
    }

    @GetMapping("/getAll")
    public List<Account> getAllAccount() {
        return accountService.getAllAccount();
    }
}
