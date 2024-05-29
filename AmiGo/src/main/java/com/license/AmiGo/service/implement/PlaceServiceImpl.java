package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Place;
import com.license.AmiGo.model.Post;
import com.license.AmiGo.repository.PlaceRepository;
import com.license.AmiGo.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceServiceImpl implements PlaceService {
    @Autowired
    private PlaceRepository placeRepository;

    public List<Place> getPlaceByCounty(String county) {
        return placeRepository.getPlaceByCounty(county);
    }

    public Place savePlace(Place place) {
        return placeRepository.save(place);
    }
    public void createAccountVisitPlaceRelationship(long post_id, long place_id) {
        placeRepository.createAccountVisitPlaceRelationship(post_id, place_id);
    }
    public void accountMentionedPlace(long place_id) {
        placeRepository.accountMentionedPlace(place_id);
    }
    public Place getPlaceByPostId(long post_id) {
        return placeRepository.getPlaceByPostId(post_id);
    }
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }
    public Place getPlaceByPlaceId(long place_id) {
        return placeRepository.getPlaceByPlaceId(place_id);
    }

    public List<Post> getPostByPlaceId(long place_id) {
        return placeRepository.getPostByPlaceId(place_id);
    }
}
