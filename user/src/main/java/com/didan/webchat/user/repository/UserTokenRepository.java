package com.didan.webchat.user.repository;

import com.didan.webchat.user.constant.TokenType;
import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserTokenRepository extends JpaRepository<UserToken, Long> {

    Optional<UserToken> findByToken(String token);

    List<UserToken> findByUser(User user);

    List<UserToken> findByUserAndTokenType(User user, TokenType tokenType);

    @Query("SELECT t FROM UserToken t WHERE t.user = ?1 AND t.tokenType = ?2 AND t.expired = false AND t.revoked = false AND t.expiresAt > ?3")
    List<UserToken> findValidTokensByUserAndTokenType(User user, TokenType tokenType, LocalDateTime now);

    @Query("SELECT t FROM UserToken t WHERE t.expiresAt < ?1 AND (t.expired = false OR t.revoked = false)")
    List<UserToken> findExpiredTokens(LocalDateTime now);

    void deleteByUser(User user);
}
