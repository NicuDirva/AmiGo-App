package com.license.AmiGo.service.implement;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Profile;
import com.license.AmiGo.repository.AccountRepository;
import com.license.AmiGo.repository.ProfileRepository;
import com.license.AmiGo.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private ProfileRepository profileRepository;
    @Override
    public Profile saveProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    public void editDescription(Profile profile) {
        Profile existingProfile = profileRepository.findById(profile.getProfile_id())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existingProfile.setDescription(profile.getDescription());

        profileRepository.save(existingProfile);
    }

    @Override
    public void editAvatar(Profile profile) {
        Profile existingProfile = profileRepository.findById(profile.getProfile_id())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existingProfile.setImg_url(profile.getImg_url());

        profileRepository.save(existingProfile);
    }
    @Override
    public void editLocation(Profile profile) {
        Profile existingProfile = profileRepository.findById(profile.getProfile_id())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existingProfile.setLocation(profile.getLocation());
        profileRepository.save(existingProfile);
    }

    public void editGender(Profile profile) {
        Profile existingProfile = profileRepository.findById(profile.getProfile_id())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existingProfile.setGender(profile.getGender());

        profileRepository.save(existingProfile);
    }
    public void editAccess(Profile profile) {
        Profile existingProfile = profileRepository.findById(profile.getProfile_id())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existingProfile.setAccess(profile.getAccess());

        profileRepository.save(existingProfile);
    }

    @Override
    public String getAvatarbyId(long account_id) {
        return profileRepository.getAvatar(account_id);
    }
    public Profile getProfileById(long profile_id) {
        return profileRepository.getProfileById(profile_id);
    }

    public void editDob(Profile profile) {
        Profile existingProfile = profileRepository.findById(profile.getProfile_id())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        existingProfile.setDob(profile.getDob());

        profileRepository.save(existingProfile);
    }

    @Override
    public List<Profile> getAllProfile() {
        return profileRepository.findAll();
    }
}
