package com.didan.webchat.user.service.impl;

import com.didan.archetype.service.AuthService;
import com.didan.webchat.user.constant.TokenType;
import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserToken;
import com.didan.webchat.user.exception.BadRequestException;
import com.didan.webchat.user.repository.UserTokenRepository;
import com.didan.webchat.user.service.UserTokenService;
import com.didan.webchat.user.util.DateUtils;
import io.jsonwebtoken.Claims;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserTokenServiceImpl implements UserTokenService {

  private final UserTokenRepository userTokenRepository;
  private final AuthService authService;

  @Override
  public void saveToken(User user, TokenType tokenType, String token, long lifetime) {
    log.info("Saving token for user: {}, type: {}, token: {}, lifetime: {}",
             user.getUsername(), tokenType, token, lifetime);

    Claims claims = authService.getClaims(token);
    if (claims == null) {
      log.error("Invalid token claims for user: {}, type: {}", user.getUsername(), tokenType);
      throw new BadRequestException("Invalid token claims");
    }
    Long issuedAt = claims.get("iat", Long.class);
    Long expiredAt = claims.get("exp", Long.class);
    LocalDateTime issuedAtDateTime = DateUtils.convertTimeJwtToLocalDateTime(issuedAt);
    LocalDateTime expiredAtDateTime = DateUtils.convertTimeJwtToLocalDateTime(expiredAt);
    UserToken userToken = UserToken.builder()
        .user(user)
        .tokenType(tokenType)
        .token(token)
        .createdAt(issuedAtDateTime)
        .expiresAt(expiredAtDateTime)
        .expired(false)
        .revoked(false)
        .build();
    userTokenRepository.save(userToken);
  }

}
