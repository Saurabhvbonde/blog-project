package com.blog.repository;

import com.blog.entity.Post;
import com.blog.entity.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE p.status = :status AND (" +
            ":search IS NULL OR :search = '' " +
            "OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.author.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.tags) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Post> searchByStatus(@Param("status") PostStatus status, @Param("search") String search, Pageable pageable);

    List<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId);

    List<Post> findByStatusOrderByCreatedAtDesc(PostStatus status);

    @Query("SELECT p.author.username, COUNT(p) " +
            "FROM Post p GROUP BY p.author.username ORDER BY COUNT(p) DESC")
    List<Object[]> findMostActiveUsers();

    List<Post> findTop10ByStatusOrderByViewsDesc(PostStatus status);
}
