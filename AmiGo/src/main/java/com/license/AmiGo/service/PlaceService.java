package com.license.AmiGo.service;

import com.license.AmiGo.model.Place;
import com.license.AmiGo.model.Post;

import java.util.List;

public interface PlaceService {
    List<Place> getPlaceByCounty(String county);

    Place savePlace(Place place);
    void createAccountVisitPlaceRelationship(long post_id, long place_id);
    void accountMentionedPlace(long place_id);
    Place getPlaceByPostId(long post_id);
    Place getPlaceByPlaceId(long place_id);
    List<Post> getPostByPlaceId(long place_id);
    List<Place> getAllPlaces();
}
