package com.didan.webchat.user.repository;

import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserActivity;
import com.didan.webchat.user.entity.UserActivity.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    List<UserActivity> findByUserOrderByTimestampDesc(User user);

    List<UserActivity> findByUserIdOrderByTimestampDesc(Long userId);

    List<UserActivity> findByActivityType(ActivityType activityType);

    List<UserActivity> findByUserAndActivityType(User user, ActivityType activityType);

    List<UserActivity> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM UserActivity a WHERE a.user.id = ?1 AND a.timestamp >= ?2 ORDER BY a.timestamp DESC")
    List<UserActivity> findUserActivitiesSince(Long userId, LocalDateTime since);

    @Query("SELECT a FROM UserActivity a WHERE a.activityType = ?1 AND a.timestamp >= ?2 ORDER BY a.timestamp DESC")
    List<UserActivity> findActivitiesByTypeSince(ActivityType activityType, LocalDateTime since);
}
