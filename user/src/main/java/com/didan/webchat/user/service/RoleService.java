package com.didan.webchat.user.service;

import com.didan.webchat.user.constant.RoleConstant;
import com.didan.webchat.user.entity.User;

/**
 * @author dannd1
 * @since 6/13/2025
 */
public interface RoleService {
  void assignRoleToUser(User user, RoleConstant roleName);
}
