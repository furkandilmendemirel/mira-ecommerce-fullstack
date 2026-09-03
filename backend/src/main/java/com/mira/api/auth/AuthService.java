package com.mira.api.auth;

import com.mira.api.common.ConflictException;
import com.mira.api.common.UnauthorizedException;
import com.mira.api.user.Role;
import com.mira.api.user.User;
import com.mira.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordService passwordService;
    private final TokenService tokenService;
    private final CurrentUserService currentUserService;

    public AuthService(UserRepository userRepository, PasswordService passwordService, TokenService tokenService,
                       CurrentUserService currentUserService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ConflictException("Bu e-posta adresi zaten kayıtlı");
        }

        User user = new User(request.name().trim(), email, passwordService.hash(request.password()), Role.CUSTOMER);
        return response(userRepository.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(this::invalidCredentials);
        if (!passwordService.matches(request.password(), user.getPasswordHash())) throw invalidCredentials();
        return response(user);
    }

    public UserResponse me(String authorizationHeader) {
        return UserResponse.from(currentUserService.require(authorizationHeader));
    }

    private AuthResponse response(User user) {
        return new AuthResponse(tokenService.create(user), UserResponse.from(user));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private UnauthorizedException invalidCredentials() {
        return new UnauthorizedException("E-posta veya şifre hatalı");
    }
}
