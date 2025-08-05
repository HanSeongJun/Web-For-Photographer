package backend.WebFroPhto.config;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class RegionGridConfig {
    
    // 지역별 격자 좌표 (기상청 API용)
    private static final Map<String, GridCoordinate> REGION_GRID_MAP = new HashMap<>();
    
    static {
        // 서울
        REGION_GRID_MAP.put("SEOUL", new GridCoordinate(60, 127));
        // 부산
        REGION_GRID_MAP.put("BUSAN", new GridCoordinate(98, 76));
        // 대구
        REGION_GRID_MAP.put("DAEGU", new GridCoordinate(89, 90));
        // 인천
        REGION_GRID_MAP.put("INCHEON", new GridCoordinate(55, 124));
        // 광주
        REGION_GRID_MAP.put("GWANGJU", new GridCoordinate(58, 74));
        // 대전
        REGION_GRID_MAP.put("DAEJEON", new GridCoordinate(67, 100));
        // 울산
        REGION_GRID_MAP.put("ULSAN", new GridCoordinate(102, 84));
        // 세종
        REGION_GRID_MAP.put("SEJONG", new GridCoordinate(66, 103));
        // 경기도
        REGION_GRID_MAP.put("GYEONGGI", new GridCoordinate(60, 120));
        // 강원도
        REGION_GRID_MAP.put("GANGWON", new GridCoordinate(73, 134));
        // 충청북도
        REGION_GRID_MAP.put("CHUNGBUK", new GridCoordinate(69, 107));
        // 충청남도
        REGION_GRID_MAP.put("CHUNGNAM", new GridCoordinate(55, 110));
        // 전라북도
        REGION_GRID_MAP.put("JEONBUK", new GridCoordinate(63, 89));
        // 전라남도
        REGION_GRID_MAP.put("JEONNAM", new GridCoordinate(51, 67));
        // 경상북도
        REGION_GRID_MAP.put("GYEONGBUK", new GridCoordinate(89, 91));
        // 경상남도
        REGION_GRID_MAP.put("GYEONGNAM", new GridCoordinate(91, 76));
        // 제주
        REGION_GRID_MAP.put("JEJU", new GridCoordinate(53, 38));
    }
    
    public static GridCoordinate getGridCoordinate(String regionCode) {
        return REGION_GRID_MAP.get(regionCode);
    }
    
    public static class GridCoordinate {
        private final int nx; // 격자 X 좌표
        private final int ny; // 격자 Y 좌표
        
        public GridCoordinate(int nx, int ny) {
            this.nx = nx;
            this.ny = ny;
        }
        
        public int getNx() { return nx; }
        public int getNy() { return ny; }
    }
} 