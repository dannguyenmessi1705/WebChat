package com.didan.webchat.user.repository;

import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

    List<UserRole> findByUserId(Long userId);

    List<UserRole> findByRoleId(Long roleId);

    @Query("SELECT ur FROM UserRole ur WHERE ur.user.id = ?1 AND ur.role.name = ?2")
    List<UserRole> findByUserIdAndRoleName(Long userId, String roleName);

    void deleteByUser(User user);
}
