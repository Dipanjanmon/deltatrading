package com.dipanjan.deltatrading.security;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws java.io.IOException, jakarta.servlet.ServletException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String username = JwtUtil.validateTokenAndGetUsername(token);

                org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        username, null, java.util.Collections.emptyList());

                org.springframework.security.core.context.SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            } catch (Exception e) {
                // Token is invalid/expired.
                // Do NOT block the request. Just don't set authentication.
                // The SecurityConfig will handle 401/403 if the endpoint requires auth.
                System.out.println("JWT Verification Failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
