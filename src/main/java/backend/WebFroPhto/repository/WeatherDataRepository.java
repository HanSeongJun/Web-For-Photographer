package backend.WebFroPhto.repository;

import backend.WebFroPhto.entity.WeatherData;
import backend.WebFroPhto.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    
    Optional<WeatherData> findTopByRegionOrderByMeasuredAtDesc(Region region);
    
    List<WeatherData> findByRegionAndMeasuredAtBetween(Region region, LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT w FROM WeatherData w WHERE w.region.id = :regionId ORDER BY w.measuredAt DESC LIMIT 1")
    Optional<WeatherData> findLatestByRegionId(Long regionId);
    
    List<WeatherData> findByRegionIdOrderByMeasuredAtDesc(Long regionId);
    
    Optional<WeatherData> findTopByRegionIdOrderByMeasuredAtDesc(Long regionId);
} 