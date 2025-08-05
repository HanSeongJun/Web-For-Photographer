package backend.WebFroPhto.dto.photospot;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PhotoSpotDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer weatherScore;
    private String imageUrl;
    private Long regionId;
    private String regionName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 