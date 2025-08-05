package backend.WebFroPhto.service;

import backend.WebFroPhto.dto.weather.AirQualityDto;
import backend.WebFroPhto.dto.weather.WeatherForecastDto;
import backend.WebFroPhto.dto.weather.WeatherGradeDto;
import backend.WebFroPhto.entity.Region;
import backend.WebFroPhto.entity.WeatherData;
import backend.WebFroPhto.repository.RegionRepository;
import backend.WebFroPhto.repository.WeatherDataRepository;
import backend.WebFroPhto.dto.weather.WeatherDto;
import backend.WebFroPhto.config.RegionGridConfig;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@CacheConfig(cacheNames = "weatherCache")
public class WeatherService {

    @Autowired
    private WeatherDataRepository weatherDataRepository;

    @Autowired
    private RegionRepository regionRepository;

    private final JSONParser jsonParser = new JSONParser();

    private static final String API_KEY = "q73yaTldqjjaBgY9hUkXkd3lsTL84xOfD8BSm8yfaWtM64x8yc%2BrKzBc3N4sOFBnxYIKJHqpOp4QmC%2FtYGkqAA%3D%3D";
    private static final String AIR_QUALITY_API_URL = "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty";
    private static final String WEATHER_API_URL = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";

    // 지역 코드와 시도명 매핑
    private static final Map<String, String> REGION_NAME_MAP = new HashMap<>();
    static {
        REGION_NAME_MAP.put("SEOUL", "서울특별시");
        REGION_NAME_MAP.put("BUSAN", "부산광역시");
        REGION_NAME_MAP.put("DAEGU", "대구광역시");
        REGION_NAME_MAP.put("INCHEON", "인천광역시");
        REGION_NAME_MAP.put("GWANGJU", "광주광역시");
        REGION_NAME_MAP.put("DAEJEON", "대전광역시");
        REGION_NAME_MAP.put("ULSAN", "울산광역시");
        REGION_NAME_MAP.put("SEJONG", "세종특별자치시");
        REGION_NAME_MAP.put("GYEONGGI", "경기도");
        REGION_NAME_MAP.put("GANGWON", "강원도");
        REGION_NAME_MAP.put("CHUNGBUK", "충청북도");
        REGION_NAME_MAP.put("CHUNGNAM", "충청남도");
        REGION_NAME_MAP.put("JEONBUK", "전라북도");
        REGION_NAME_MAP.put("JEONNAM", "전라남도");
        REGION_NAME_MAP.put("GYEONGBUK", "경상북도");
        REGION_NAME_MAP.put("GYEONGNAM", "경상남도");
        REGION_NAME_MAP.put("JEJU", "제주특별자치도");
    }
    
    // 캐시된 날씨 데이터
    private Map<String, String> cachedWeatherMap = new HashMap<>();
    private LocalDateTime lastUpdateTime = null;

    // 10분마다 자동으로 날씨 데이터 업데이트
    @Scheduled(fixedRate = 600000) // 10분 = 600,000ms
    public void updateWeatherDataScheduled() {
        System.out.println("=== 스케줄링된 날씨 데이터 업데이트 시작 ===");
        System.out.println("업데이트 시간: " + LocalDateTime.now());
        
        try {
            Map<String, String> newWeatherMap = fetchWeatherDataFromAPI();
            this.cachedWeatherMap = newWeatherMap;
            this.lastUpdateTime = LocalDateTime.now();
            
            System.out.println("=== 스케줄링된 날씨 데이터 업데이트 완료 ===");
            System.out.println("캐시된 데이터: " + cachedWeatherMap);
            System.out.println("마지막 업데이트 시간: " + lastUpdateTime);
            
        } catch (Exception e) {
            System.err.println("스케줄링된 날씨 데이터 업데이트 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // API에서 실제 날씨 데이터를 가져오는 메서드
    private Map<String, String> fetchWeatherDataFromAPI() {
        Map<String, String> weatherMap = new HashMap<>();
        
        // 실제 API 호출로 날씨 데이터 가져오기
        for (String regionCode : REGION_NAME_MAP.keySet()) {
            try {
                System.out.println("=== " + regionCode + " 지역 날씨 데이터 조회 시작 ===");
                
                // 현재 처리 중인 지역 코드 설정
                setCurrentRegionCode(regionCode);
                
                // 기상청 단기예보 데이터만 사용
                WeatherForecastDto weather = getWeatherForecastData(regionCode);
                
                // 기상 데이터만으로 등급 계산
                WeatherGradeDto grade = calculateWeatherGradeFromWeatherOnly(weather);
                
                weatherMap.put(regionCode, grade.getGrade());
                System.out.println(regionCode + " 지역 등급: " + grade.getGrade() + " (점수: " + grade.getScore() + ")");
                
            } catch (Exception e) {
                System.err.println("=== " + regionCode + " 지역 데이터 조회 실패 ===");
                System.err.println("오류 메시지: " + e.getMessage());
                System.err.println("오류 타입: " + e.getClass().getSimpleName());
                System.err.println("스택 트레이스:");
                e.printStackTrace();
                
                // API 호출 실패 시 FAILED 등급으로 설정
                weatherMap.put(regionCode, "FAILED");
                System.out.println(regionCode + " 지역: API 실패로 인해 FAILED 등급으로 설정");
            }
        }
        
        System.out.println("실제 API 데이터 반환: " + weatherMap);
        return weatherMap;
    }
    
    // 캐시된 데이터를 반환하는 메서드 (빠른 응답)
    public Map<String, String> getWeatherMapData() {
        // 캐시된 데이터가 없으면 초기 데이터 로드
        if (cachedWeatherMap.isEmpty()) {
            System.out.println("캐시된 데이터가 없어 초기 데이터를 로드합니다.");
            updateWeatherDataScheduled();
        }
        
        System.out.println("캐시된 날씨 데이터 반환: " + cachedWeatherMap);
        System.out.println("마지막 업데이트 시간: " + lastUpdateTime);
        
        return new HashMap<>(cachedWeatherMap);
    }

    private WeatherGradeDto calculateWeatherGradeFromWeatherOnly(WeatherForecastDto weather) {
        int score = calculateWeatherScore(weather);
        String grade = determineGrade(score);
        
        WeatherGradeDto gradeDto = new WeatherGradeDto();
        gradeDto.setScore(score);
        gradeDto.setGrade(grade);
        
        return gradeDto;
    }

    private int calculateWeatherScore(WeatherForecastDto weather) {
        int score = 0;
        
        // 1. 하늘상태 (SKY) - 구름이 적을수록 좋음 (가중치 60%)
        int skyScore = 0;
        switch (weather.getCloudCover()) {
            case 1: // 맑음
                skyScore = 100;
                break;
            case 3: // 구름많음
                skyScore = 90;  // 구름많음도 사진찍기 좋음
                break;
            case 4: // 흐림
                skyScore = 70;  // 흐림도 나쁘지 않음
                break;
            default:
                skyScore = 80;
        }
        
        // 2. 더미 미세먼지 데이터 (가중치 40%)
        int airQualityScore = 0;
        // 지역별로 다른 더미 미세먼지 값 설정
        String regionCode = getCurrentRegionCode();
        int dummyPm10 = getDummyPm10Value(regionCode);
        
        if (dummyPm10 <= 30) {
            airQualityScore = 100; // 좋음
        } else if (dummyPm10 <= 80) {
            airQualityScore = 80;  // 보통
        } else if (dummyPm10 <= 150) {
            airQualityScore = 60;  // 나쁨
        } else {
            airQualityScore = 40;  // 매우 나쁨
        }
        
        // 가중 평균 계산 (하늘상태 60%, 미세먼지 40%)
        score = (int) (skyScore * 0.6 + airQualityScore * 0.4);
        
        System.out.println("날씨 점수 계산: 하늘(" + skyScore + ") + 미세먼지(" + airQualityScore + ", PM10=" + dummyPm10 + ") = " + score);
        
        return score;
    }
    
    // 지역별 더미 미세먼지 값 반환
    private int getDummyPm10Value(String regionCode) {
        // 지역별로 다른 더미 값 설정 (실제로는 랜덤하거나 고정값)
        switch (regionCode) {
            case "SEOUL": return 45;    // 서울 - 보통
            case "BUSAN": return 25;    // 부산 - 좋음
            case "DAEGU": return 35;    // 대구 - 보통
            case "INCHEON": return 25;  // 인천 - 좋음
            case "GWANGJU": return 30;  // 광주 - 좋음
            case "DAEJEON": return 40;  // 대전 - 보통
            case "ULSAN": return 20;    // 울산 - 좋음
            case "SEJONG": return 35;   // 세종 - 보통
            case "JEJU": return 15;     // 제주 - 좋음
            case "GYEONGGI": return 50; // 경기도 - 보통
            case "GANGWON": return 35;  // 강원도 - 보통 (산악지형 고려)
            case "CHUNGBUK": return 30; // 충청북도 - 좋음
            case "CHUNGNAM": return 40; // 충청남도 - 보통
            case "JEONBUK": return 35;  // 전라북도 - 보통
            case "JEONNAM": return 25;  // 전라남도 - 좋음
            case "GYEONGBUK": return 45; // 경상북도 - 보통
            case "GYEONGNAM": return 30; // 경상남도 - 좋음
            default: return 40; // 기본값
        }
    }
    
    // 현재 처리 중인 지역 코드를 저장할 변수
    private String currentRegionCode = null;
    
    // 지역 코드 설정
    private void setCurrentRegionCode(String regionCode) {
        this.currentRegionCode = regionCode;
    }
    
    // 현재 지역 코드 반환
    private String getCurrentRegionCode() {
        return currentRegionCode != null ? currentRegionCode : "SEOUL";
    }
    
    // NO_DATA 응답 시 사용할 더미 날씨 데이터 생성
    private WeatherForecastDto createDummyWeatherData(String regionCode) {
        System.out.println(regionCode + " 지역: 더미 날씨 데이터 생성");
        
        // 지역별로 다른 더미 데이터 설정
        switch (regionCode) {
            case "SEOUL":
                return new WeatherForecastDto(3, 65, 22.0, 3.0, 10); // 구름많음, 보통
            case "BUSAN":
                return new WeatherForecastDto(1, 70, 25.0, 2.0, 15); // 맑음, 좋음
            case "DAEGU":
                return new WeatherForecastDto(4, 75, 28.0, 1.5, 8);  // 흐림, 보통
            case "INCHEON":
                return new WeatherForecastDto(1, 65, 22.0, 3.0, 15); // 맑음, 좋음
            case "GWANGJU":
                return new WeatherForecastDto(1, 72, 24.0, 2.5, 15); // 맑음, 좋음
            case "DAEJEON":
                return new WeatherForecastDto(3, 70, 23.0, 3.0, 10); // 구름많음, 보통
            case "ULSAN":
                return new WeatherForecastDto(1, 68, 26.0, 2.0, 15); // 맑음, 좋음
            case "SEJONG":
                return new WeatherForecastDto(3, 65, 21.0, 2.5, 12); // 구름많음, 보통
            case "JEJU":
                return new WeatherForecastDto(1, 75, 27.0, 3.5, 15); // 맑음, 좋음
            case "GYEONGGI":
                return new WeatherForecastDto(3, 67, 22.5, 3.0, 10); // 구름많음, 보통
            case "GANGWON":
                return new WeatherForecastDto(3, 65, 15.0, 3.5, 8); // 구름많음, 보통 (산악지형 고려)
            case "CHUNGBUK":
                return new WeatherForecastDto(3, 70, 23.5, 2.5, 10); // 구름많음, 보통
            case "CHUNGNAM":
                return new WeatherForecastDto(4, 72, 24.5, 3.5, 8);  // 흐림, 보통
            case "JEONBUK":
                return new WeatherForecastDto(3, 68, 25.0, 2.0, 10); // 구름많음, 보통
            case "JEONNAM":
                return new WeatherForecastDto(1, 70, 26.0, 2.5, 15); // 맑음, 좋음
            case "GYEONGBUK":
                return new WeatherForecastDto(4, 73, 23.0, 3.0, 8);  // 흐림, 보통
            case "GYEONGNAM":
                return new WeatherForecastDto(1, 69, 25.5, 2.0, 15); // 맑음, 좋음
            default:
                return new WeatherForecastDto(3, 70, 24.0, 2.5, 10); // 기본값
        }
    }

    private String determineGrade(int score) {
        if (score >= 75) return "GOOD";     // 75점 이상 - 좋음 (하늘색)
        else if (score >= 60) return "NORMAL"; // 60-74점 - 중간 (주황색)
        else return "BAD";                     // 60점 미만 - 나쁨 (빨간색)
    }

    // @Cacheable(value = "airQuality", key = "#regionCode", unless = "#result == null", cacheManager = "cacheManager")
    private AirQualityDto getAirQualityData(String regionCode) throws Exception {
        String regionName = REGION_NAME_MAP.get(regionCode);
        if (regionName == null) {
            throw new Exception("지원하지 않는 지역 코드: " + regionCode);
        }

        String url = AIR_QUALITY_API_URL + 
                    "?serviceKey=" + API_KEY + 
                    "&sidoName=" + java.net.URLEncoder.encode(regionName, "UTF-8") + 
                    "&returnType=json" +
                    "&dataType=JSON" +
                    "&numOfRows=50" + 
                    "&pageNo=1";

        System.out.println("미세먼지 API URL: " + url);

        try {
            // HttpURLConnection 사용하여 더 자세한 정보 확인
            URL apiUrl = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) apiUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");

            System.out.println("미세먼지 API 응답 코드: " + conn.getResponseCode());
            System.out.println("미세먼지 API 응답 메시지: " + conn.getResponseMessage());

            BufferedReader rd;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }

            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                responseBody.append(line);
            }
            rd.close();
            conn.disconnect();

            String responseString = responseBody.toString();
            System.out.println("미세먼지 API 응답 본문: " + responseString.substring(0, Math.min(500, responseString.length())));

            // HTTP 에러 상태 확인
            if (conn.getResponseCode() < 200 || conn.getResponseCode() > 300) {
                System.out.println("미세먼지 API 호출 실패 - HTTP 상태: " + conn.getResponseCode());
                throw new Exception("API 호출 실패 - HTTP 상태: " + conn.getResponseCode());
            }

            // HTML/XML 응답 확인
            if (responseString != null && responseString.trim().startsWith("<")) {
                System.out.println("미세먼지 API가 HTML/XML 응답을 반환했습니다. API 키나 엔드포인트를 확인하세요.");
                throw new Exception("API가 HTML/XML 응답을 반환했습니다. 인증 실패 또는 잘못된 엔드포인트");
            }

            // JSON 파싱 (참고 코드 구조 적용)
            JSONObject jsonObject = (JSONObject) jsonParser.parse(responseString);
            JSONObject responseNode = (JSONObject) jsonObject.get("response");
            
            if (responseNode == null) {
                System.out.println("미세먼지 API 응답에 response 노드가 없습니다: " + responseString);
                throw new Exception("미세먼지 API 응답 형식이 올바르지 않습니다");
            }
            
            JSONObject bodyNode = (JSONObject) responseNode.get("body");
            if (bodyNode == null) {
                System.out.println("미세먼지 API 응답에 body 노드가 없습니다. responseNode: " + responseNode);
                throw new Exception("미세먼지 API 응답에 body 노드가 없습니다");
            }
            
            Object itemsObj = bodyNode.get("items");
            JSONArray itemsNode;
            
            if (itemsObj instanceof JSONArray) {
                itemsNode = (JSONArray) itemsObj;
            } else if (itemsObj instanceof JSONObject) {
                // items가 객체인 경우, 그 안의 item 배열을 찾기
                JSONObject itemsObject = (JSONObject) itemsObj;
                itemsNode = (JSONArray) itemsObject.get("item");
                if (itemsNode == null) {
                    System.out.println("미세먼지 API 응답에 item 배열이 없습니다. itemsObject: " + itemsObject);
                    throw new Exception("미세먼지 API 응답에 item 배열이 없습니다");
                }
            } else {
                System.out.println("미세먼지 API 응답의 items가 예상과 다른 형식입니다: " + itemsObj);
                throw new Exception("미세먼지 API 응답의 items 형식이 올바르지 않습니다");
            }

            System.out.println("미세먼지 데이터 개수: " + itemsNode.size());

            AirQualityDto airQuality = new AirQualityDto();
            int pm10Sum = 0;
            int pm25Sum = 0;
            int count = 0;

            for (Object item : itemsNode) {
                JSONObject itemObj = (JSONObject) item;
                String pm10Str = (String) itemObj.get("pm10Value");
                String pm25Str = (String) itemObj.get("pm25Value");
                
                if (!pm10Str.equals("-") && !pm25Str.equals("-") && !pm10Str.isEmpty() && !pm25Str.isEmpty()) {
                    try {
                        pm10Sum += Integer.parseInt(pm10Str);
                        pm25Sum += Integer.parseInt(pm25Str);
                        count++;
                    } catch (NumberFormatException e) {
                        System.out.println("숫자 변환 실패: pm10=" + pm10Str + ", pm25=" + pm25Str);
                    }
                }
            }

            if (count > 0) {
                airQuality.setPm10(pm10Sum / count);
                airQuality.setPm25(pm25Sum / count);
                airQuality.setPm10Grade(getPm10Grade(airQuality.getPm10()));
                airQuality.setPm25Grade(getPm25Grade(airQuality.getPm25()));
            } else {
                airQuality.setPm10(0);
                airQuality.setPm25(0);
                airQuality.setPm10Grade("NORMAL");
                airQuality.setPm25Grade("NORMAL");
            }

            System.out.println(regionCode + " 지역 미세먼지 데이터: " + airQuality);
            return airQuality;

        } catch (Exception e) {
            System.out.println("미세먼지 API 호출 실패: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private String getPm10Grade(int pm10) {
        if (pm10 <= 30) return "GOOD";
        else if (pm10 <= 80) return "NORMAL";
        else if (pm10 <= 150) return "POOR";
        else return "VERY_POOR";
    }

    private String getPm25Grade(int pm25) {
        if (pm25 <= 15) return "GOOD";
        else if (pm25 <= 35) return "NORMAL";
        else if (pm25 <= 75) return "POOR";
        else return "VERY_POOR";
    }

    // @Cacheable(value = "weatherForecast", key = "#regionCode", unless = "#result == null", cacheManager = "cacheManager")
    private WeatherForecastDto getWeatherForecastData(String regionCode) throws Exception {
        String regionName = REGION_NAME_MAP.get(regionCode);
        if (regionName == null) {
            throw new Exception("지원하지 않는 지역 코드: " + regionCode);
        }

        // 현재 날짜와 시간 계산
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        String baseDate = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // 기상청 발표시간 규칙: 02, 05, 08, 11, 14, 17, 20, 23시
        int currentHour = now.getHour();
        String baseTime;
        
        if (currentHour < 2) {
            // 전날 23시 발표 사용
            baseTime = "2300";
            baseDate = now.minusDays(1).format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        } else if (currentHour < 5) {
            baseTime = "0200";
        } else if (currentHour < 8) {
            baseTime = "0500";
        } else if (currentHour < 11) {
            baseTime = "0800";
        } else if (currentHour < 14) {
            baseTime = "1100";
        } else if (currentHour < 17) {
            baseTime = "1400";
        } else if (currentHour < 20) {
            baseTime = "1700";
        } else if (currentHour < 23) {
            baseTime = "2000";
        } else {
            baseTime = "2300";
        }

        // 지역별 격자 좌표 가져오기
        RegionGridConfig.GridCoordinate coord = RegionGridConfig.getGridCoordinate(regionCode);
        if (coord == null) {
            throw new Exception("지역 격자 좌표를 찾을 수 없습니다: " + regionCode);
        }
        System.out.println(regionCode + " 지역 격자 좌표: nx=" + coord.getNx() + ", ny=" + coord.getNy());

        String url = WEATHER_API_URL + 
                    "?serviceKey=" + API_KEY + 
                    "&pageNo=1" +
                    "&numOfRows=1000" +
                    "&dataType=JSON" +
                    "&base_date=" + baseDate +
                    "&base_time=" + baseTime +
                    "&nx=" + coord.getNx() +
                    "&ny=" + coord.getNy();

        System.out.println("기상 예보 API URL: " + url);
        System.out.println("API 키 길이: " + API_KEY.length());
        System.out.println("API 키 (처음 20자): " + API_KEY.substring(0, Math.min(20, API_KEY.length())));

        try {
            // HttpURLConnection 사용하여 더 자세한 정보 확인
            URL apiUrl = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) apiUrl.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-type", "application/json");

            System.out.println("기상 예보 API 응답 코드: " + conn.getResponseCode());
            System.out.println("기상 예보 API 응답 메시지: " + conn.getResponseMessage());

            BufferedReader rd;
            if (conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
                rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }

            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                responseBody.append(line);
            }
            rd.close();
            conn.disconnect();

            String responseString = responseBody.toString();
            System.out.println("기상 예보 API 응답 본문: " + responseString.substring(0, Math.min(500, responseString.length())));

            // HTTP 에러 상태 확인
            if (conn.getResponseCode() < 200 || conn.getResponseCode() > 300) {
                System.out.println("기상 예보 API 호출 실패 - HTTP 상태: " + conn.getResponseCode());
                System.out.println("응답 메시지: " + conn.getResponseMessage());
                System.out.println("요청 URL: " + url);
                throw new Exception("API 호출 실패 - HTTP 상태: " + conn.getResponseCode());
            }

            // HTML/XML 응답 확인
            if (responseString != null && responseString.trim().startsWith("<")) {
                System.out.println("기상 예보 API가 HTML/XML 응답을 반환했습니다. API 키나 엔드포인트를 확인하세요.");
                throw new Exception("API가 HTML/XML 응답을 반환했습니다. 인증 실패 또는 잘못된 엔드포인트");
            }

            // JSON 파싱
            JSONObject jsonObject = (JSONObject) jsonParser.parse(responseString);
            JSONObject responseNode = (JSONObject) jsonObject.get("response");
            
            if (responseNode == null) {
                System.out.println("API 응답에 response 노드가 없습니다: " + responseString);
                throw new Exception("API 응답 형식이 올바르지 않습니다");
            }
            
            // 응답 헤더 확인
            JSONObject headerNode = (JSONObject) responseNode.get("header");
            if (headerNode != null) {
                String resultCode = (String) headerNode.get("resultCode");
                String resultMsg = (String) headerNode.get("resultMsg");
                System.out.println("API 응답 헤더 - resultCode: " + resultCode + ", resultMsg: " + resultMsg);
                
                // API 오류 확인 - NO_DATA는 정상적인 응답으로 처리
                if (!"00".equals(resultCode) && !"03".equals(resultCode)) {
                    System.out.println("API 오류 발생: " + resultMsg);
                    throw new Exception("API 오류: " + resultMsg);
                }
                
                // NO_DATA인 경우 더미 데이터 사용
                if ("03".equals(resultCode)) {
                    System.out.println("NO_DATA 응답 - 더미 데이터 사용");
                    return createDummyWeatherData(regionCode);
                }
            }
            
            JSONObject bodyNode = (JSONObject) responseNode.get("body");
            if (bodyNode == null) {
                System.out.println("API 응답에 body 노드가 없습니다. responseNode: " + responseNode);
                System.out.println("전체 응답: " + responseString);
                throw new Exception("API 응답에 body 노드가 없습니다");
            }
            
            Object itemsObj = bodyNode.get("items");
            JSONArray itemsNode;
            
            if (itemsObj instanceof JSONArray) {
                itemsNode = (JSONArray) itemsObj;
            } else if (itemsObj instanceof JSONObject) {
                // items가 객체인 경우, 그 안의 item 배열을 찾기
                JSONObject itemsObject = (JSONObject) itemsObj;
                itemsNode = (JSONArray) itemsObject.get("item");
                if (itemsNode == null) {
                    System.out.println("기상 예보 API 응답에 item 배열이 없습니다. itemsObject: " + itemsObject);
                    throw new Exception("기상 예보 API 응답에 item 배열이 없습니다");
                }
            } else {
                System.out.println("기상 예보 API 응답의 items가 예상과 다른 형식입니다: " + itemsObj);
                throw new Exception("기상 예보 API 응답의 items 형식이 올바르지 않습니다");
            }

            System.out.println("기상 예보 데이터 개수: " + itemsNode.size());

            WeatherForecastDto weather = new WeatherForecastDto();
            int skySum = 0, rehSum = 0, tmpSum = 0, wsdSum = 0;
            int skyCount = 0, rehCount = 0, tmpCount = 0, wsdCount = 0;

            for (Object item : itemsNode) {
                JSONObject itemObj = (JSONObject) item;
                String category = (String) itemObj.get("category");
                String value = (String) itemObj.get("fcstValue");

                if (category.equals("SKY")) {
                    try {
                        skySum += Integer.parseInt(value);
                        skyCount++;
                    } catch (NumberFormatException e) {
                        System.out.println("SKY 값 변환 실패: " + value);
                    }
                } else if (category.equals("REH")) {
                    try {
                        rehSum += Integer.parseInt(value);
                        rehCount++;
                    } catch (NumberFormatException e) {
                        System.out.println("REH 값 변환 실패: " + value);
                    }
                } else if (category.equals("TMP")) {
                    try {
                        tmpSum += Integer.parseInt(value);
                        tmpCount++;
                    } catch (NumberFormatException e) {
                        System.out.println("TMP 값 변환 실패: " + value);
                    }
                } else if (category.equals("WSD")) {
                    try {
                        // 소수점이 있는 경우를 처리
                        double wsdValue = Double.parseDouble(value);
                        wsdSum += (int) Math.round(wsdValue);
                        wsdCount++;
                    } catch (NumberFormatException e) {
                        System.out.println("WSD 값 변환 실패: " + value);
                    }
                }
            }

            if (skyCount > 0) {
                weather.setCloudCover(skySum / skyCount);
            } else {
                weather.setCloudCover(3); // 기본값: 구름많음
            }
            
            if (rehCount > 0) {
                weather.setHumidity(rehSum / rehCount);
            } else {
                weather.setHumidity(50); // 기본값: 50%
            }
            
            if (tmpCount > 0) {
                weather.setTemperature(tmpSum / tmpCount);
            } else {
                weather.setTemperature(20.0); // 기본값: 20°C
            }
            
            if (wsdCount > 0) {
                weather.setWindSpeed(wsdSum / wsdCount);
            } else {
                weather.setWindSpeed(3.0); // 기본값: 3m/s
            }

            System.out.println(regionCode + " 지역 기상 데이터: " + weather);
            return weather;

        } catch (Exception e) {
            System.out.println("기상 예보 API 호출 실패: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    // 기존 메서드들...
    public List<WeatherDto> getAllWeatherData() {
        return weatherDataRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<WeatherDto> getWeatherDataById(Long id) {
        return weatherDataRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<WeatherDto> getWeatherDataByRegion(Long regionId) {
        return weatherDataRepository.findByRegionIdOrderByMeasuredAtDesc(regionId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public WeatherDto getLatestWeatherDataByRegion(Long regionId) {
        return weatherDataRepository.findTopByRegionIdOrderByMeasuredAtDesc(regionId)
                .map(this::convertToDto)
                .orElse(null);
    }

    public WeatherDto createWeatherData(WeatherDto weatherDto) {
        WeatherData weatherData = new WeatherData();
        weatherData.setTemperature(weatherDto.getTemperature());
        weatherData.setHumidity(weatherDto.getHumidity());
        weatherData.setWindSpeed(weatherDto.getWindSpeed());
        weatherData.setWeatherCondition(weatherDto.getWeatherCondition());
        weatherData.setWeatherGrade(weatherDto.getWeatherGrade());
        weatherData.setPm10(weatherDto.getPm10());
        weatherData.setPm25(weatherDto.getPm25());
        weatherData.setMeasuredAt(weatherDto.getMeasuredAt());
        weatherData.setCreatedAt(LocalDateTime.now());

        if (weatherDto.getRegionId() != null) {
            Optional<Region> region = regionRepository.findById(weatherDto.getRegionId());
            region.ifPresent(weatherData::setRegion);
        }

        WeatherData savedWeatherData = weatherDataRepository.save(weatherData);
        return convertToDto(savedWeatherData);
    }

    public Optional<WeatherDto> updateWeatherData(Long id, WeatherDto weatherDto) {
        return weatherDataRepository.findById(id).map(weatherData -> {
            weatherData.setTemperature(weatherDto.getTemperature());
            weatherData.setHumidity(weatherDto.getHumidity());
            weatherData.setWindSpeed(weatherDto.getWindSpeed());
            weatherData.setWeatherCondition(weatherDto.getWeatherCondition());
            weatherData.setWeatherGrade(weatherDto.getWeatherGrade());
            weatherData.setPm10(weatherDto.getPm10());
            weatherData.setPm25(weatherDto.getPm25());
            weatherData.setMeasuredAt(weatherDto.getMeasuredAt());

            if (weatherDto.getRegionId() != null) {
                Optional<Region> region = regionRepository.findById(weatherDto.getRegionId());
                region.ifPresent(weatherData::setRegion);
            }

            WeatherData savedWeatherData = weatherDataRepository.save(weatherData);
            return convertToDto(savedWeatherData);
        });
    }

    public boolean deleteWeatherData(Long id) {
        if (weatherDataRepository.existsById(id)) {
            weatherDataRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private WeatherDto convertToDto(WeatherData weatherData) {
        WeatherDto dto = new WeatherDto();
        dto.setId(weatherData.getId());
        dto.setTemperature(weatherData.getTemperature());
        dto.setHumidity(weatherData.getHumidity());
        dto.setWindSpeed(weatherData.getWindSpeed());
        dto.setWeatherCondition(weatherData.getWeatherCondition());
        dto.setWeatherGrade(weatherData.getWeatherGrade());
        dto.setPm10(weatherData.getPm10());
        dto.setPm25(weatherData.getPm25());
        dto.setMeasuredAt(weatherData.getMeasuredAt());
        dto.setCreatedAt(weatherData.getCreatedAt());
        
        if (weatherData.getRegion() != null) {
            dto.setRegionId(weatherData.getRegion().getId());
            dto.setRegionName(weatherData.getRegion().getName());
        }
        
        return dto;
    }
}