package com.license.AmiGo.controller;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Profile;
import com.license.AmiGo.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profile")
@CrossOrigin
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @PostMapping("/add")
    public String add(@RequestBody Profile profile) {
        profileService.saveProfile(profile);
        return "Profile added";
    }

    @GetMapping("/getAll")
    public List<Profile> getAllProfile() {
        return profileService.getAllProfile();
    }
}
