package com.didan.webchat.user.service.impl;

import com.didan.archetype.locale.Translator;
import com.didan.webchat.user.constant.RoleConstant;
import com.didan.webchat.user.entity.User;
import com.didan.webchat.user.entity.UserRole;
import com.didan.webchat.user.exception.ResourceNotFoundException;
import com.didan.webchat.user.repository.RoleRepository;
import com.didan.webchat.user.repository.UserRoleRepository;
import com.didan.webchat.user.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * @author dannd1
 * @since 6/16/2025
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

  private final RoleRepository roleRepository;
  private final UserRoleRepository userRoleRepository;


  @Override
  public void assignRoleToUser(User user, RoleConstant roleName) {
    log.info("assign role {} to user {}", roleName, user.getUsername());
    UserRole userRole = UserRole.builder()
        .user(user)
        .role(roleRepository.findByName(roleName.name())
            .orElseThrow(() -> new ResourceNotFoundException(
                Translator.toLocale("msg.role.not.found", roleName.name()))))
        .build();
    userRoleRepository.save(userRole);
  }
}
