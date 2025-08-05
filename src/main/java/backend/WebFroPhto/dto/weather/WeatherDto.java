package backend.WebFroPhto.dto.weather;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WeatherDto {
    
    private Long id;
    private Long regionId;
    private String regionName;
    private BigDecimal temperature;
    private Integer humidity;
    private BigDecimal windSpeed;
    private String weatherCondition;
    private Integer pm10;
    private Integer pm25;
    private String weatherGrade;
    private LocalDateTime measuredAt;
    private LocalDateTime createdAt;
    
    // 기본 생성자
    public WeatherDto() {}
    
    // Getter와 Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }
    
    public String getRegionName() { return regionName; }
    public void setRegionName(String regionName) { this.regionName = regionName; }
    
    public BigDecimal getTemperature() { return temperature; }
    public void setTemperature(BigDecimal temperature) { this.temperature = temperature; }
    
    public Integer getHumidity() { return humidity; }
    public void setHumidity(Integer humidity) { this.humidity = humidity; }
    
    public BigDecimal getWindSpeed() { return windSpeed; }
    public void setWindSpeed(BigDecimal windSpeed) { this.windSpeed = windSpeed; }
    
    public String getWeatherCondition() { return weatherCondition; }
    public void setWeatherCondition(String weatherCondition) { this.weatherCondition = weatherCondition; }
    
    public Integer getPm10() { return pm10; }
    public void setPm10(Integer pm10) { this.pm10 = pm10; }
    
    public Integer getPm25() { return pm25; }
    public void setPm25(Integer pm25) { this.pm25 = pm25; }
    
    public String getWeatherGrade() { return weatherGrade; }
    public void setWeatherGrade(String weatherGrade) { this.weatherGrade = weatherGrade; }
    
    public LocalDateTime getMeasuredAt() { return measuredAt; }
    public void setMeasuredAt(LocalDateTime measuredAt) { this.measuredAt = measuredAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 