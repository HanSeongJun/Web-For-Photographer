package backend.WebFroPhto.dto.comment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private String author;
    private Long authorId;
    private Integer likesCount;
    private Long postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 