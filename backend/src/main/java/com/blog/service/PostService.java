package com.blog.service;

import com.blog.dto.post.PageResponse;
import com.blog.dto.post.PostRequest;
import com.blog.dto.post.PostResponse;
import com.blog.entity.Post;
import com.blog.entity.PostStatus;
import com.blog.entity.User;
import com.blog.exception.AccessDeniedApiException;
import com.blog.exception.ResourceNotFoundException;
import com.blog.repository.PostRepository;
import com.blog.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private static final int EXCERPT_LENGTH = 160;

    private final PostRepository postRepository;
    private final CurrentUserProvider currentUserProvider;

    public PageResponse<PostResponse> getPublishedFeed(String search, String sort, int page, int size) {
        Sort sortOrder = switch (sort == null ? "date" : sort) {
            case "popularity" -> Sort.by(Sort.Direction.DESC, "views");
            case "author" -> Sort.by(Sort.Direction.ASC, "author.username");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Page<Post> result = postRepository.searchByStatus(PostStatus.PUBLISHED, search, pageable);

        return PageResponse.<PostResponse>builder()
                .content(result.getContent().stream().map(this::toResponse).toList())
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @Transactional
    public PostResponse getById(Long id) {
        Post post = findPostOrThrow(id);
        post.setViews(post.getViews() + 1);
        return toResponse(post);
    }

    public List<PostResponse> getMyPosts() {
        User currentUser = currentUserProvider.getCurrentUser();
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(currentUser.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public PostResponse createPost(PostRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .tags(request.getTags())
                .author(currentUser)
                .status(PostStatus.PENDING)
                .build();
        return toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest request) {
        Post post = findPostOrThrow(id);
        User currentUser = currentUserProvider.getCurrentUser();

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new AccessDeniedApiException("You can only edit your own posts");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setTags(request.getTags());
        post.setStatus(PostStatus.PENDING);
        return toResponse(postRepository.save(post));
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = findPostOrThrow(id);
        User currentUser = currentUserProvider.getCurrentUser();

        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new AccessDeniedApiException("You can only delete your own posts");
        }
        postRepository.delete(post);
    }

    private Post findPostOrThrow(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + id));
    }

    PostResponse toResponse(Post post) {
        String content = post.getContent();
        String excerpt = content.length() > EXCERPT_LENGTH
                ? content.substring(0, EXCERPT_LENGTH) + "..."
                : content;

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .excerpt(excerpt)
                .tags(post.getTags())
                .author(post.getAuthor().getUsername())
                .authorId(post.getAuthor().getId())
                .status(post.getStatus().name())
                .featured(post.isFeatured())
                .views(post.getViews())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
