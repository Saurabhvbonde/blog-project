package com.blog.dto.admin;

import com.blog.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRequest {

    @NotNull(message = "Role is required")
    private Role role;
}
