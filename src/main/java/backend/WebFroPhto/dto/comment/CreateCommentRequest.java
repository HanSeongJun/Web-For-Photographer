package backend.WebFroPhto.dto.comment;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private String content;
    private String author;
    private Long authorId;
    private Long postId;
} 