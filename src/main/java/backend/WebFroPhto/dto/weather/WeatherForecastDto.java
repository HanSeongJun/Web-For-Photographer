package backend.WebFroPhto.dto.weather;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherForecastDto {
    private int cloudCover; // SKY (하늘상태)
    private int humidity;   // REH (습도)
    private double temperature; // TMP (기온)
    private double windSpeed;   // WSD (풍속)
    private int visibility;     // VEC (가시거리)
} 