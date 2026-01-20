package com.dipanjan.deltatrading.security;

import com.dipanjan.deltatrading.entity.User;
import com.dipanjan.deltatrading.repository.UserRepository;
import com.dipanjan.deltatrading.security.JwtUtil; // Assuming you have this
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Optional;

@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public CustomAuthenticationSuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        // Simple logic: if user exists by email, login. If not, create.
        Optional<User> existingUser = userRepository.findByEmail(email);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            // Create new Google user
            user = new User();
            // Use email as username, but if it exists as a username (rare conflict), append
            // random
            String baseUsername = email.split("@")[0];
            String newUsername = baseUsername;
            if (userRepository.existsByUsername(newUsername)) {
                newUsername = baseUsername + "_" + System.currentTimeMillis();
            }
            user.setUsername(newUsername);

            user.setEmail(email);
            user.setFullName(name);
            user.setProfilePictureUrl(picture);
            user.setPassword(""); // No password for OAuth users
            user.setBalance(new BigDecimal("10000.00")); // Starting balance
            userRepository.save(user);
        }

        String token = JwtUtil.generateToken(user.getUsername());

        // Redirect to frontend with token
        response.sendRedirect("http://localhost:5173/oauth2/callback?token=" + token);
    }
}
