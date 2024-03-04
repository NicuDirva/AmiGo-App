package com.license.AmiGo.service;

import com.license.AmiGo.model.Account;

import java.util.List;

public interface AccountService {
    Account saveAccount(Account account);
    List<Account> getAllAccount();
}
