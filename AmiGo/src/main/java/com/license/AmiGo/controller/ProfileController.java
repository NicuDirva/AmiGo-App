package com.license.AmiGo.controller;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Profile;
import com.license.AmiGo.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000")
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

    @PostMapping("/editDob")
    public void editDob(@RequestBody Profile profile) {
        profileService.editDob(profile);
    }

    @PostMapping("/editDescription")
    public void editDescription(@RequestBody Profile profile) {
        profileService.editDescription(profile);
    }

    @PostMapping("/editAvatar")
    public void editAvatar(@RequestBody Profile profile) {
        profileService.editAvatar(profile);
    }

    @PostMapping("/editGender")
    public void editGender(@RequestBody Profile profile) {
        profileService.editGender(profile);
    }

    @GetMapping("/getAvatarById")
    public String getAvatarById(@RequestParam("account_id") long account_id) {
        return profileService.getAvatarbyId(account_id);
    }
}
