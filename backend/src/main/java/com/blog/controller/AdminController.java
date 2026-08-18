package com.blog.controller;

import com.blog.dto.admin.ReportItem;
import com.blog.dto.admin.UpdateUserRequest;
import com.blog.dto.post.PostResponse;
import com.blog.dto.user.UserResponse;
import com.blog.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ---- Manage Posts ----

    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(adminService.getAllPosts());
    }

    @PutMapping("/posts/{id}/feature")
    public ResponseEntity<PostResponse> toggleFeature(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleFeature(id));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // ---- Post Moderation ----

    @PutMapping("/posts/{id}/approve")
    public ResponseEntity<PostResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.approvePost(id));
    }

    @PutMapping("/posts/{id}/reject")
    public ResponseEntity<PostResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.rejectPost(id));
    }

    @PutMapping("/posts/{id}/remove")
    public ResponseEntity<PostResponse> remove(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.removePost(id));
    }

    // ---- Manage Users ----

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(adminService.updateUserRole(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ---- Reports ----

    @GetMapping("/reports")
    public ResponseEntity<List<ReportItem>> getReport(@RequestParam String type) {
        return ResponseEntity.ok(adminService.getReport(type));
    }
}
