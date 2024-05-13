package com.license.AmiGo.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
public class Group_request {
    @Id@GeneratedValue
    private long group_request_id;
    private long group_id;
    private long account_id;

    public Group_request(long group_id, long account_id) {
        this.group_id = group_id;
        this.account_id = account_id;
    }
    public Group_request() {

    }

    public long getGroup_request() {
        return group_request_id;
    }

    public void setGroup_request(long group_request_id) {
        this.group_request_id = group_request_id;
    }

    public long getGroup_id() {
        return group_id;
    }

    public void setGroup_id(long group_id) {
        this.group_id = group_id;
    }

    public long getAccount_id() {
        return account_id;
    }

    public void setAccount_id(long account_id) {
        this.account_id = account_id;
    }
}
