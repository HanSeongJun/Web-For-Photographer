package backend.WebFroPhto.dto.region;

import java.math.BigDecimal;

public class RegionDto {
    
    private Long id;
    private String name;
    private String code;
    private String type;
    private Long parentId;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer photoSpotCount;
    private String weatherGrade;
    
    // 기본 생성자
    public RegionDto() {}
    
    // Getter와 Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    
    public Integer getPhotoSpotCount() { return photoSpotCount; }
    public void setPhotoSpotCount(Integer photoSpotCount) { this.photoSpotCount = photoSpotCount; }
    
    public String getWeatherGrade() { return weatherGrade; }
    public void setWeatherGrade(String weatherGrade) { this.weatherGrade = weatherGrade; }
} 