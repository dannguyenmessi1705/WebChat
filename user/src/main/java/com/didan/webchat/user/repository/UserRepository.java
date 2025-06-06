package com.didan.webchat.user.repository;

import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.constant.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByStatus(UserStatus status);

    @Query("SELECT u FROM User u WHERE u.username LIKE %?1% OR u.fullName LIKE %?1% OR u.email LIKE %?1%")
    List<User> searchUsers(String searchTerm);

    @Query("SELECT c FROM User u JOIN u.contacts c WHERE u.id = ?1")
    List<User> findAllContactsByUserId(Long userId);
}
