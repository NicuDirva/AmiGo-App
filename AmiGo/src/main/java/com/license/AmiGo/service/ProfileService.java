package com.license.AmiGo.service;

import com.license.AmiGo.model.Account;
import com.license.AmiGo.model.Profile;

import java.util.List;

public interface ProfileService {
    Profile saveProfile(Profile profile);
    List<Profile> getAllProfile();

    void editDescription(Profile profile);
    void editAvatar(Profile profile);
    Profile getProfileById(long profile_id);
    void editLocation(Profile profile);
    void editDob(Profile profile);
    void editGender(Profile profile);
    void editAccess(Profile profile);

    String getAvatarbyId(long account_id);

    void deleteProfileByAccountId(long account_id);

}
