package backend.WebFroPhto.dto.post;

import lombok.Data;

import java.util.List;

@Data
public class CreatePostRequest {
    private String title;
    private String content;
    private String author;
    private String imageUrl;
    private Long photoSpotId;
    private List<String> tags;
} 