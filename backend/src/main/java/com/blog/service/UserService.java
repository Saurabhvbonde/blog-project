package com.blog.service;

import com.blog.dto.user.UserResponse;
import com.blog.entity.User;
import com.blog.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final CurrentUserProvider currentUserProvider;

    public UserResponse getCurrentUserProfile() {
        return toResponse(currentUserProvider.getCurrentUser());
    }

    static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
