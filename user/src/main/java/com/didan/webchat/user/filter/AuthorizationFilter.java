package com.didan.webchat.user.filter;

import com.didan.archetype.constant.TrackingContextEnum;
import com.didan.archetype.service.AuthService;
import com.didan.archetype.utils.UtilsCommon;
import com.didan.webchat.user.constant.ResponseStatusCodeEnumV2;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.ThreadContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

/**
 * @author dannd1
 * @since 6/3/2025
 */
@Configuration
@Order(3)
@Slf4j
@RequiredArgsConstructor
public class AuthorizationFilter extends OncePerRequestFilter {

  private final AuthService authService;

  @Value("#{'${app.api.whitelist}'.split(',')}")
  private final Set<String> whitelist;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    if (UtilsCommon.isIgnoredUri(request.getRequestURI()) || whitelist.stream().anyMatch(request.getRequestURI()::contains)) {
      filterChain.doFilter(request, response);
      return;
    }

    final String authorizationHeader = request.getHeader("Authorization");

    if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
      String jwtToken = authorizationHeader.substring(7);
      if (!authService.verifyToken(jwtToken)) {
        UtilsCommon.sendError(new ContentCachingResponseWrapper(response), ResponseStatusCodeEnumV2.TOKEN_ERROR);
        return;
      }
      ThreadContext.put(TrackingContextEnum.USER.getThreadKey(), authService.getClaims(jwtToken).get(TrackingContextEnum.USER.getHeaderKey()).toString());
    } else {
      UtilsCommon.sendError(new ContentCachingResponseWrapper(response), ResponseStatusCodeEnumV2.TOKEN_ERROR);
      return;
    }

    filterChain.doFilter(request, response);
  }
}
