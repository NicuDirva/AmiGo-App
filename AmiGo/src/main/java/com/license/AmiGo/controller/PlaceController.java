package com.license.AmiGo.controller;


import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Place;
import com.license.AmiGo.model.Post;
import com.license.AmiGo.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/place")
@CrossOrigin(origins = "http://localhost:3000")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    @PatchMapping("/getPlaceByCounty")
    public List<Place> getPlaceByCounty(@RequestBody String county) {
        return placeService.getPlaceByCounty(county);
    }

    @GetMapping("/getAll")
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    @PatchMapping("/getPlaceByPostId")
    public Place getPlaceByPostId(@RequestBody Long post_id) {
        return placeService.getPlaceByPostId(post_id);
    }

    @PatchMapping("/getPlaceByPlaceId")
    public Place getPlaceByPlaceId(@RequestBody Long place_id) {
        return placeService.getPlaceByPlaceId(place_id);
    }

    @PatchMapping("/getPostByPlaceId")
    public List<Post> getPostByPlaceId(@RequestBody Long place_id) {
        return placeService.getPostByPlaceId(place_id);
    }

    @PostMapping("/add")
    public Place add(@RequestBody Place place) {
        return placeService.savePlace(place);
    }

    @PatchMapping("/createAccountVisitPlaceRelationship")
    public void createAccountVisitPlaceRelationship(@RequestBody Map<String, Long> request) {
        Long post_id = request.get("post_id");
        Long place_id = request.get("place_id");
        placeService.createAccountVisitPlaceRelationship(post_id, place_id);
    }

    @PatchMapping("/accountMentionedPlace")
    public void accountMentionedPlace(@RequestBody Long place_id) {
        placeService.accountMentionedPlace(place_id);
    }

}
