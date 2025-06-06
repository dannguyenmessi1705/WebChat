package com.didan.webchat.user.dto;

import com.didan.webchat.user.constant.ActivityType;
import com.didan.webchat.user.entity.User;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventDTO {

  ActivityType eventName;
  String description;
  User user;
}
