package com.didan.webchat.user.service;

import com.didan.webchat.user.constant.ActivityType;
import com.didan.webchat.user.entity.User;

public interface LogActivityService {
  void logActivity(User user, ActivityType activityType, String description);
}
