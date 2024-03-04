package com.license.AmiGo.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import java.util.Date;

@Node
public class Account {
    @Id @GeneratedValue
    private long account_id;
    private Date account_date_created;
    private String password;
    private String username;
    private String email;

    public Account() {
    }

    @Override
    public String toString() {
        return "Account{" +
                "account_id=" + account_id +
                ", account_date_created=" + account_date_created +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }

    public Account(Date account_date_created, String password, String username, String email) {
        this.account_date_created = account_date_created;
        this.password = password;
        this.username = username;
        this.email = email;
    }

    public long getAccount_id() {
        return account_id;
    }

    public void setAccount_id(int account_id) {
        this.account_id = account_id;
    }

    public Date getAccount_date_created() {
        return account_date_created;
    }

    public void setAccount_date_created(Date account_date_created) {
        this.account_date_created = account_date_created;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
