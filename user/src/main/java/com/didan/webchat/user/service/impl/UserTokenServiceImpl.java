package com.didan.webchat.user.service.impl;

import com.didan.webchat.user.constant.TokenType;
import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserToken;
import com.didan.webchat.user.repository.UserTokenRepository;
import com.didan.webchat.user.service.UserTokenService;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserTokenServiceImpl implements UserTokenService {

  private final UserTokenRepository userTokenRepository;

  @Override
  public void saveToken(User user, TokenType tokenType, String token, long lifetime) {
    log.info("Saving token for user: {}, type: {}, token: {}, lifetime: {}",
             user.getUsername(), tokenType, token, lifetime);

    LocalDateTime issueAt = LocalDateTime.now();
    LocalDateTime expirationTime = issueAt.plusSeconds(lifetime);
    UserToken userToken = UserToken.builder()
        .user(user)
        .tokenType(tokenType)
        .token(token)
        .createdAt(issueAt)
        .expiresAt(expirationTime)
        .expired(false)
        .revoked(false)
        .build();
    userTokenRepository.save(userToken);
  }

}
