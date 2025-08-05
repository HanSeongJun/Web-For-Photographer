package backend.WebFroPhto.dto.weather;

import lombok.Data;

@Data
public class AirQualityDto {
    private String regionName;
    private Integer pm10;      // 미세먼지
    private Integer pm25;      // 초미세먼지
    private String pm10Grade;  // 미세먼지 등급
    private String pm25Grade;  // 초미세먼지 등급
    private String dataTime;   // 측정 시간
} 