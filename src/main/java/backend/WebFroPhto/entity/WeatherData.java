package backend.WebFroPhto.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data")
public class WeatherData {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private Region region;
    
    @Column(nullable = false)
    private BigDecimal temperature;
    
    private Integer humidity;
    
    @Column(name = "wind_speed")
    private BigDecimal windSpeed;
    
    @Column(name = "weather_condition")
    private String weatherCondition;
    
    @Column(name = "pm10")
    private Integer pm10;
    
    @Column(name = "pm25")
    private Integer pm25;
    
    @Column(name = "weather_grade")
    private String weatherGrade;
    
    @Column(name = "measured_at")
    private LocalDateTime measuredAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // 기본 생성자
    public WeatherData() {}
    
    // 생성자
    public WeatherData(Region region, BigDecimal temperature, String weatherCondition) {
        this.region = region;
        this.temperature = temperature;
        this.weatherCondition = weatherCondition;
        this.measuredAt = LocalDateTime.now();
    }
    
    // Getter와 Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    
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