package backend.WebFroPhto.controller;

import backend.WebFroPhto.dto.region.RegionDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/regions")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175"})
public class RegionController {

    @GetMapping
    public ResponseEntity<List<RegionDto>> getAllRegions() {
        // 임시 데이터
        RegionDto seoul = new RegionDto();
        seoul.setId(1L);
        seoul.setName("서울특별시");
        seoul.setCode("11");
        seoul.setType("시도");
        seoul.setLatitude(new BigDecimal("37.5665"));
        seoul.setLongitude(new BigDecimal("126.9780"));
        seoul.setPhotoSpotCount(8);
        seoul.setWeatherGrade("좋음");
        
        RegionDto incheon = new RegionDto();
        incheon.setId(2L);
        incheon.setName("인천광역시");
        incheon.setCode("28");
        incheon.setType("시도");
        incheon.setLatitude(new BigDecimal("37.4563"));
        incheon.setLongitude(new BigDecimal("126.7052"));
        incheon.setPhotoSpotCount(7);
        incheon.setWeatherGrade("최고");
        
        return ResponseEntity.ok(Arrays.asList(seoul, incheon));
    }
} 