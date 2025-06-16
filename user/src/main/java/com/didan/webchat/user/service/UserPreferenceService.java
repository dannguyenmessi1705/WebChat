package com.didan.webchat.user.service;

import com.didan.webchat.user.dto.request.PreferenceDTO;
import com.didan.webchat.user.entity.User;

/**
 * @author dannd1
 * @since 6/16/2025
 */
public interface UserPreferenceService {
  void setUserPreference(User user, PreferenceDTO preference);
}
