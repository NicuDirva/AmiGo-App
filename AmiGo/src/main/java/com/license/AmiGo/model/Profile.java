package com.license.AmiGo.model;

import com.license.AmiGo.enums.Gender;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
public class Profile {

    @Id @GeneratedValue
    private long profile_id;
    private int account_id;
    private String img_url;
    private String description;
    private Gender gender;
}
