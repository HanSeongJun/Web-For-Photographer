package backend.WebFroPhto.controller;

import backend.WebFroPhto.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175"})
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    private final Random random = new Random();

    /**
     * 전국 날씨 지도 데이터 반환 (실제 API 데이터 사용)
     * @return 지역별 날씨 등급 맵
     */
    @GetMapping("/map")
    public ResponseEntity<Map<String, String>> getWeatherMap() {
        System.out.println("날씨 지도 API 호출됨");
        
        try {
            // 실제 API 데이터로 등급 산정
            Map<String, String> weatherMap = weatherService.getWeatherMapData();
            System.out.println("실제 API 데이터 반환: " + weatherMap);
            return ResponseEntity.ok(weatherMap);
        } catch (Exception e) {
            System.err.println("날씨 데이터 조회 실패: " + e.getMessage());
            e.printStackTrace(); // 스택 트레이스 출력
            // API 호출 실패 시 기본 데이터 반환
            Map<String, String> defaultMap = getDefaultWeatherMap();
            System.out.println("기본 데이터 반환: " + defaultMap);
            return ResponseEntity.ok(defaultMap);
        }
    }

    /**
     * 기본 날씨 데이터 (API 실패 시 사용)
     */
    private Map<String, String> getDefaultWeatherMap() {
        Map<String, String> weatherMap = new HashMap<>();
        weatherMap.put("SEOUL", "GOOD");
        weatherMap.put("BUSAN", "FAIR");
        weatherMap.put("DAEGU", "POOR");
        weatherMap.put("INCHEON", "FAIR");
        weatherMap.put("GWANGJU", "GOOD");
        weatherMap.put("DAEJEON", "FAIR");
        weatherMap.put("ULSAN", "POOR");
        weatherMap.put("SEJONG", "GOOD");
        weatherMap.put("GYEONGGI", "FAIR");
        weatherMap.put("GANGWON", "GOOD");
        weatherMap.put("CHUNGBUK", "FAIR");
        weatherMap.put("CHUNGNAM", "POOR");
        weatherMap.put("JEONBUK", "FAIR");
        weatherMap.put("JEONNAM", "GOOD");
        weatherMap.put("GYEONGBUK", "FAIR");
        weatherMap.put("GYEONGNAM", "GOOD");
        weatherMap.put("JEJU", "FAIR");
        return weatherMap;
    }

    /**
     * 특정 지역의 상세 날씨 정보 반환
     * @param regionCode 지역 코드 (예: SEOUL, BUSAN)
     * @return 상세 날씨 정보
     */
    @GetMapping("/grade/{regionCode}")
    public ResponseEntity<Map<String, Object>> getRegionWeatherGrade(@PathVariable String regionCode) {
        Map<String, Object> response = new HashMap<>();
        
        // 지역 이름 매핑
        Map<String, String> regionNames = getRegionNames();
        String regionName = regionNames.getOrDefault(regionCode, "알 수 없는 지역");
        
        // 더미 날씨 데이터 생성 (실제로는 기상청 API에서 가져올 데이터)
        int temperature = random.nextInt(35) + 5; // 5-40도
        int humidity = random.nextInt(40) + 40;   // 40-80%
        int pm10 = random.nextInt(100) + 20;      // 20-120 μg/m³
        int pm25 = random.nextInt(50) + 10;       // 10-60 μg/m³
        double windSpeed = Math.round((random.nextDouble() * 10 + 1) * 10) / 10.0; // 1-11 m/s
        
        String[] conditions = {"맑음", "구름조금", "구름많음", "흐림", "비", "눈"};
        String condition = conditions[random.nextInt(conditions.length)];
        
        // 날씨 등급 계산
        String grade = calculateWeatherGrade(pm10, pm25, condition);
        
        response.put("regionCode", regionCode);
        response.put("regionName", regionName);
        response.put("temperature", temperature);
        response.put("humidity", humidity);
        response.put("pm10", pm10);
        response.put("pm25", pm25);
        response.put("windSpeed", windSpeed);
        response.put("condition", condition);
        response.put("grade", grade);
        response.put("recommendation", getRecommendation(grade));
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }

    /**
     * 날씨 등급 계산 로직
     */
    private String calculateWeatherGrade(Integer pm10, Integer pm25, String condition) {
        // 간단한 등급 계산 로직 (실제로는 더 복잡한 알고리즘 사용)
        if (pm10 > 80 || pm25 > 35 || condition.equals("비") || condition.equals("눈")) {
            return "POOR";
        } else if (pm10 > 50 || pm25 > 25 || condition.equals("흐림")) {
            return "FAIR";
        } else {
            return "GOOD";
        }
    }

    /**
     * 등급별 추천 메시지
     */
    private String getRecommendation(String grade) {
        switch (grade) {
            case "GOOD":
                return "야외 활동하기 좋은 날씨입니다! 사진 촬영을 즐겨보세요.";
            case "FAIR":
                return "보통 날씨입니다. 가벼운 야외 활동이 가능합니다.";
            case "POOR":
                return "실내 활동을 권장합니다. 외출 시 마스크를 착용하세요.";
            default:
                return "날씨 정보를 확인할 수 없습니다.";
        }
    }

    /**
     * 지역 코드별 이름 반환
     */
    private Map<String, String> getRegionNames() {
        Map<String, String> regionNames = new HashMap<>();
        regionNames.put("SEOUL", "서울특별시");
        regionNames.put("BUSAN", "부산광역시");
        regionNames.put("DAEGU", "대구광역시");
        regionNames.put("INCHEON", "인천광역시");
        regionNames.put("GWANGJU", "광주광역시");
        regionNames.put("DAEJEON", "대전광역시");
        regionNames.put("ULSAN", "울산광역시");
        regionNames.put("SEJONG", "세종특별자치시");
        regionNames.put("GYEONGGI", "경기도");
        regionNames.put("GANGWON", "강원특별자치도");
        regionNames.put("CHUNGBUK", "충청북도");
        regionNames.put("CHUNGNAM", "충청남도");
        regionNames.put("JEONBUK", "전북특별자치도");
        regionNames.put("JEONNAM", "전라남도");
        regionNames.put("GYEONGBUK", "경상북도");
        regionNames.put("GYEONGNAM", "경상남도");
        regionNames.put("JEJU", "제주특별자치도");
        return regionNames;
    }
} 