package com.uiktp.entities.users.dtos;

import com.uiktp.entities.users.UserRole;

public record RegisterDTO(String name, String email, String password, UserRole role) {
}
