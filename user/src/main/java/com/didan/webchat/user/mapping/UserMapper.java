package com.didan.webchat.user.mapping;

import com.didan.webchat.user.dto.mapping.UserDTO;
import com.didan.webchat.user.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

  UserDTO toDTO(User user);

  User toEntity(UserDTO userDTO);
}
