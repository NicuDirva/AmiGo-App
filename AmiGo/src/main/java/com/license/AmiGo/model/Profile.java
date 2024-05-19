package com.license.AmiGo.model;

import com.license.AmiGo.enums.Gender;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
public class Profile {

    @Id @GeneratedValue
    private long profile_id;
    private long account_id;
    private String img_url;
    private String description;
    private Gender gender;
    private String dob;

    private String access;
    private String location;

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public Profile(String location, long account_id, String img_url, String description, Gender gender, String dob, String access) {
        this.account_id = account_id;
        this.location = location;
        this.img_url = img_url;
        this.description = description;
        this.gender = gender;
        this.dob = dob;
        this.access = access;
    }
    public Profile() {

    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAccess() {
        return access;
    }

    public void setAccess(String access) {
        this.access = access;
    }

    public long getProfile_id() {
        return profile_id;
    }

    public void setProfile_id(long profile_id) {
        this.profile_id = profile_id;
    }

    public long getAccount_id() {
        return account_id;
    }

    public void setAccount_id(long account_id) {
        this.account_id = account_id;
    }

    public String getImg_url() {
        return img_url;
    }

    public void setImg_url(String img_url) {
        this.img_url = img_url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

}
