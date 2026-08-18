package com.blog.service;

import com.blog.dto.admin.ReportItem;
import com.blog.dto.admin.UpdateUserRequest;
import com.blog.dto.post.PostResponse;
import com.blog.dto.user.UserResponse;
import com.blog.entity.Post;
import com.blog.entity.PostStatus;
import com.blog.entity.User;
import com.blog.exception.ApiException;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostService postService;

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(postService::toResponse)
                .toList();
    }

    @Transactional
    public PostResponse toggleFeature(Long postId) {
        Post post = findPostOrThrow(postId);
        post.setFeatured(!post.isFeatured());
        return postService.toResponse(postRepository.save(post));
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = findPostOrThrow(postId);
        postRepository.delete(post);
    }

    @Transactional
    public PostResponse approvePost(Long postId) {
        return updateStatus(postId, PostStatus.PUBLISHED);
    }

    @Transactional
    public PostResponse rejectPost(Long postId) {
        return updateStatus(postId, PostStatus.REJECTED);
    }

    @Transactional
    public PostResponse removePost(Long postId) {
        return updateStatus(postId, PostStatus.REMOVED);
    }

    private PostResponse updateStatus(Long postId, PostStatus status) {
        Post post = findPostOrThrow(postId);
        post.setStatus(status);
        return postService.toResponse(postRepository.save(post));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserService::toResponse).toList();
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setRole(request.getRole());
        return UserService.toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found: " + userId);
        }
        userRepository.deleteById(userId);
    }

    public List<ReportItem> getReport(String type) {
        return switch (type) {
            case "most-active-users" -> postRepository.findMostActiveUsers().stream()
                    .map(row -> ReportItem.builder().label((String) row[0]).value((Long) row[1]).build())
                    .limit(10)
                    .toList();
            case "most-popular-posts" -> postRepository.findTop10ByStatusOrderByViewsDesc(PostStatus.PUBLISHED)
                    .stream()
                    .map(post -> ReportItem.builder().label(post.getTitle()).value(post.getViews()).build())
                    .toList();
            default -> throw new ApiException("Unknown report type: " + type, HttpStatus.BAD_REQUEST);
        };
    }

    private Post findPostOrThrow(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + id));
    }
}
