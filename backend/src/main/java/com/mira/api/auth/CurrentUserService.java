package com.mira.api.auth;

import com.mira.api.common.ResourceNotFoundException;
import com.mira.api.common.UnauthorizedException;
import com.mira.api.user.User;
import com.mira.api.user.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    public CurrentUserService(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    public User require(String authorizationHeader) {
        Long userId = tokenService.verifyAndGetUserId(bearerToken(authorizationHeader));
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Kullanıcı bulunamadı"));
    }

    private String bearerToken(String header) {
        if (header == null || !header.regionMatches(true, 0, "Bearer ", 0, 7)) {
            throw new UnauthorizedException("Bearer token gönderilmelidir");
        }
        String token = header.substring(7).trim();
        if (token.isBlank()) throw new UnauthorizedException("Bearer token gönderilmelidir");
        return token;
    }
}
