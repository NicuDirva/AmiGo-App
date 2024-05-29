package com.license.AmiGo.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node
public class Place {

    @Id@GeneratedValue
    private long place_id;
    private String county;
    private String placeName;
    private long mentionsNumber;

    public Place(long place_id, String county, String placeName, long mentionsNumber) {
        this.place_id = place_id;
        this.county = county;
        this.placeName = placeName;
        this.mentionsNumber = mentionsNumber;
    }

    public Place() {}

    @Override
    public String toString() {
        return "Place{" +
                "place_id=" + place_id +
                ", county='" + county + '\'' +
                ", placeName='" + placeName + '\'' +
                ", mentionsNumber=" + mentionsNumber +
                '}';
    }

    public long getPlace_id() {
        return place_id;
    }

    public void setPlace_id(long place_id) {
        this.place_id = place_id;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public long getMentionsNumber() {
        return mentionsNumber;
    }

    public void setMentionsNumber(long mentionsNumber) {
        this.mentionsNumber = mentionsNumber;
    }
}
