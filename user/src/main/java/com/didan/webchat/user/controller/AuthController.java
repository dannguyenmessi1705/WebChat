package com.didan.webchat.user.controller;

import com.didan.archetype.constant.ResponseStatusCode;
import com.didan.archetype.constant.ResponseStatusCodeEnum;
import com.didan.archetype.factory.response.GeneralResponse;
import com.didan.archetype.factory.response.ResponseFactory;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author dannd1
 * @since 6/3/2025
 */
@RestController
@RequestMapping("${app.application-short-name}/${app.version}/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

  private final ResponseFactory responseFactory;

  @PostMapping(value = "register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<GeneralResponse<Object>> register() {
    log.info("==> Start controller register");
    try {
      return responseFactory.success("");
    } catch (Exception ex) {
      return responseFactory.fail(ResponseStatusCodeEnum.INTERNAL_GENERAL_SERVER_ERROR);
    }
  }
}
