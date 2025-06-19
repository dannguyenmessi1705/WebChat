package com.didan.webchat.user.controller;

import com.didan.archetype.factory.response.GeneralResponse;
import com.didan.archetype.factory.response.ResponseFactory;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author dannd1
 * @since 6/16/2025
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("${app.application-short-name}/${app.version}/user")
@Slf4j
@Validated
public class UserController {

  private final ResponseFactory responseFactory;

  @Operation(security = @SecurityRequirement(name = "bearAuth"))
  @GetMapping("/{user}")
  public ResponseEntity<GeneralResponse<Object>> getUserInfo(
      @Valid @PathVariable("user") String user) {
    log.info("Get user info for user: {}", user);
    return responseFactory.success("");
  }

}
