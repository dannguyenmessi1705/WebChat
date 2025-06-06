package com.didan.webchat.user.service.impl;

import com.didan.archetype.constant.TrackingContextEnum;
import com.didan.webchat.user.constant.ActivityType;
import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserActivity;
import com.didan.webchat.user.repository.UserActivityRepository;
import com.didan.webchat.user.service.LogActivityService;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogActivityServiceImpl implements LogActivityService {

  private final UserActivityRepository userActivityRepository;

  @Override
  public void logActivity(User user, ActivityType activityType, String description) {
    log.info("Logging activity for user: {}, type: {}, description: {}", user.getUsername(), activityType, description);
    UserActivity userActivity = UserActivity.builder()
        .user(user)
        .activityType(activityType)
        .activityDetails(description)
        .timestamp(LocalDateTime.now())
        .userAgent(ThreadContext.get(TrackingContextEnum.USER_AGENT.getThreadKey()))
        .ipAddress(ThreadContext.get(TrackingContextEnum.X_REAL_IP.getThreadKey()))
        .build();
    userActivityRepository.save(userActivity);
  }
}
