package com.mira.api.auth;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mira.api.common.UnauthorizedException;
import com.mira.api.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class TokenService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long expirationSeconds;

    public TokenService(ObjectMapper objectMapper,
                        @Value("${app.auth.jwt-secret}") String secret,
                        @Value("${app.auth.token-expiration-seconds:86400}") long expirationSeconds) {
        if (secret.length() < 32) throw new IllegalArgumentException("JWT secret en az 32 karakter olmalıdır");
        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds;
    }

    public String create(User user) {
        long issuedAt = Instant.now().getEpochSecond();
        Map<String, Object> claims = new LinkedHashMap<>();
        claims.put("sub", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("iat", issuedAt);
        claims.put("exp", issuedAt + expirationSeconds);

        String header = encodeJson(Map.of("alg", "HS256", "typ", "JWT"));
        String payload = encodeJson(claims);
        String unsignedToken = header + "." + payload;
        return unsignedToken + "." + ENCODER.encodeToString(sign(unsignedToken));
    }

    public Long verifyAndGetUserId(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) throw invalidToken();

            String unsignedToken = parts[0] + "." + parts[1];
            byte[] suppliedSignature = DECODER.decode(parts[2]);
            if (!MessageDigest.isEqual(sign(unsignedToken), suppliedSignature)) throw invalidToken();

            JsonNode payload = objectMapper.readTree(DECODER.decode(parts[1]));
            if (payload.path("exp").asLong(0) <= Instant.now().getEpochSecond()) {
                throw new UnauthorizedException("Oturumun süresi dolmuş, tekrar giriş yapmalısın");
            }
            long userId = payload.path("sub").asLong(0);
            if (userId < 1) throw invalidToken();
            return userId;
        } catch (IllegalArgumentException | IOException exception) {
            throw invalidToken();
        }
    }

    private String encodeJson(Map<String, Object> value) {
        try {
            return ENCODER.encodeToString(objectMapper.writeValueAsBytes(value));
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Token oluşturulamadı", exception);
        }
    }

    private byte[] sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            return mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Token imzalanamadı", exception);
        }
    }

    private UnauthorizedException invalidToken() {
        return new UnauthorizedException("Geçersiz veya eksik oturum tokenı");
    }
}
