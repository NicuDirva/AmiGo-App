package com.license.AmiGo.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import java.util.Vector;

@Node
public class Group {
    @Id@GeneratedValue
    private long group_id;
    private long creator_id;
    private String name;
    private String access;
    private String urlImg;

    public Group(long creator_id, String name, String access, String urlImg) {
        this.creator_id = creator_id;
        this.name = name;
        this.access = access;
        this.urlImg = urlImg;
    }
    public Group() {

    }

    @Override
    public String toString() {
        return "Group{" +
                "group_id=" + group_id +
                ", creator_id=" + creator_id +
                ", name='" + name + '\'' +
                ", access='" + access + '\'' +
                ", urlImg='" + urlImg + '\'' +
                '}';
    }

    public long getGroup_id() {
        return group_id;
    }

    public void setGroup_id(long group_id) {
        this.group_id = group_id;
    }

    public long getCreator_id() {
        return creator_id;
    }

    public void setCreator_id(long creator_id) {
        this.creator_id = creator_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccess() {
        return access;
    }

    public void setAccess(String access) {
        this.access = access;
    }

    public String getUrlImg() {
        return urlImg;
    }

    public void setUrlImg(String urlImg) {
        this.urlImg = urlImg;
    }
}
