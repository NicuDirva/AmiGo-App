package com.license.AmiGo.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import java.util.Vector;

@Node
public class Post_comment {

    @Id@GeneratedValue
    private long comment_id;
    private long account_id;
    private long post_id;
    private String content;
    private String created_date;
    private Vector<Post_comment> commentArray;

    public Post_comment() {
    }

    public Post_comment(long account_id, long post_id, String content, String created_date, Vector<Post_comment> commentArray) {
        this.account_id = account_id;
        this.post_id = post_id;
        this.content = content;
        this.created_date = created_date;
        this.commentArray = commentArray;
    }

    @Override
    public String toString() {
        return "Comment{" +
                "comment_id=" + comment_id +
                ", account_id=" + account_id +
                ", post_id=" + post_id +
                ", content='" + content + '\'' +
                ", created_date='" + created_date + '\'' +
                ", commentArray=" + commentArray +
                '}';
    }

    public long getComment_id() {
        return comment_id;
    }

    public void setComment_id(long comment_id) {
        this.comment_id = comment_id;
    }

    public long getAccount_id() {
        return account_id;
    }

    public void setAccount_id(long account_id) {
        this.account_id = account_id;
    }

    public long getPost_id() {
        return post_id;
    }

    public void setPost_id(long post_id) {
        this.post_id = post_id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreated_date() {
        return created_date;
    }

    public void setCreated_date(String created_date) {
        this.created_date = created_date;
    }

    public Vector<Post_comment> getCommentArray() {
        return commentArray;
    }

    public void setCommentArray(Vector<Post_comment> commentArray) {
        this.commentArray = commentArray;
    }
}
