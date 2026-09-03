package com.mira.api.auth;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
