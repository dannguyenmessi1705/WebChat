package com.didan.webchat.user.service;

import com.didan.webchat.user.constant.TokenType;
import com.didan.webchat.user.entity.User;

public interface UserTokenService {

  void saveToken(User user, TokenType tokenType, String token, long lifetime);
}
