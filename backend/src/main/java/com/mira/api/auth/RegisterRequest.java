package com.mira.api.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Ad soyad zorunludur")
        @Size(min = 2, max = 120, message = "Ad soyad 2 ile 120 karakter arasında olmalıdır")
        String name,

        @NotBlank(message = "E-posta zorunludur")
        @Email(message = "Geçerli bir e-posta adresi girilmelidir")
        @Size(max = 160, message = "E-posta en fazla 160 karakter olabilir")
        String email,

        @NotBlank(message = "Şifre zorunludur")
        @Size(min = 8, max = 72, message = "Şifre 8 ile 72 karakter arasında olmalıdır")
        String password
) {
}
