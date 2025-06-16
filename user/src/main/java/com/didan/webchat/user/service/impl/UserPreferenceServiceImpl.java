package com.didan.webchat.user.service.impl;

import com.didan.webchat.user.constant.BooleanConstant;
import com.didan.webchat.user.constant.ThemeMode;
import com.didan.webchat.user.dto.request.PreferenceDTO;
import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserPreference;
import com.didan.webchat.user.repository.UserPreferenceRepository;
import com.didan.webchat.user.service.UserPreferenceService;
import java.util.Locale;
import java.util.Optional;
import java.util.TimeZone;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * @author dannd1
 * @since 6/16/2025
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class UserPreferenceServiceImpl implements UserPreferenceService {

  private final UserPreferenceRepository userPreferenceRepository;

  @Override
  public void setUserPreference(User user, PreferenceDTO preference) {
    log.info("Setting user preference for user: {}", user.getUsername());
    Optional<UserPreference> userSetting = userPreferenceRepository.findByUser(user);
    if (userSetting.isPresent()) {
      log.info("User preference already exists for user: {}", user.getUsername());
      // Update existing preferences
      UserPreference existingPreference = userSetting.get();
      existingPreference.setLanguage(preference.getLanguage() != null ? preference.getLanguage() : existingPreference.getLanguage());
      existingPreference.setSoundEnabled(preference.getSoundEnabled() != null ? Boolean.parseBoolean(preference.getSoundEnabled().name()) : existingPreference.isSoundEnabled());
      existingPreference.setThemeMode(preference.getThemeMode() != null ? preference.getThemeMode() : existingPreference.getThemeMode());
      existingPreference.setNotificationEnabled(preference.getNotificationEnabled() != null ? Boolean.parseBoolean(preference.getNotificationEnabled().name()) : existingPreference.isNotificationEnabled());
      existingPreference.setTimezone(preference.getTimezone() != null ? preference.getTimezone() : existingPreference.getTimezone());
      userPreferenceRepository.save(existingPreference);
      return;
    }
    // Set default preferences for the user
    UserPreference userPreference = UserPreference.builder()
        .user(user)
        .language(Locale.getDefault().getLanguage())
        .soundEnabled(true)
        .themeMode(ThemeMode.SYSTEM)
        .notificationEnabled(true)
        .timezone(TimeZone.getDefault().getID())
        .build();
    userPreferenceRepository.save(userPreference);
  }
}
