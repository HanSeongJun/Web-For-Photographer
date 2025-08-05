package backend.WebFroPhto.dto.post;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDto {
    private Long id;
    private String title;
    private String content;
    private String author;
    private String imageUrl;
    private Integer likesCount;
    private Long photoSpotId;
    private String photoSpotName;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 