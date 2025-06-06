package com.didan.webchat.user.constant;

import com.didan.archetype.constant.ResponseStatusCode;
import com.didan.archetype.constant.ResponseStatusCodeEnum;
import org.springframework.http.HttpStatus;

/**
 * @author dannd1
 * @since 6/3/2025
 */
public interface ResponseStatusCodeEnumV2 extends ResponseStatusCodeEnum {
  ResponseStatusCode TOKEN_ERROR = ResponseStatusCode.builder().code("DAN400").httpCode(HttpStatus.FORBIDDEN.value()).build();
  ResponseStatusCode ALREADY_EXIST = ResponseStatusCode.builder().code("DAN409").httpCode(HttpStatus.CONFLICT.value()).build();
  ResponseStatusCode NOT_FOUND = ResponseStatusCode.builder().code("DAN404").httpCode(HttpStatus.NOT_FOUND.value()).build();
  ResponseStatusCode UNAUTHORIZED = ResponseStatusCode.builder().code("DAN401").httpCode(HttpStatus.UNAUTHORIZED.value()).build();
  ResponseStatusCode FORBIDDEN = ResponseStatusCode.builder().code("DAN403").httpCode(HttpStatus.FORBIDDEN.value()).build();

}
