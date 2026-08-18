package com.blog.dto.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String tags;
    private String author;
    private Long authorId;
    private String status;
    private boolean featured;
    private int views;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
