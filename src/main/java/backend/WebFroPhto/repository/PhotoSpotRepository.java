package backend.WebFroPhto.repository;

import backend.WebFroPhto.entity.PhotoSpot;
import backend.WebFroPhto.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhotoSpotRepository extends JpaRepository<PhotoSpot, Long> {
    
    List<PhotoSpot> findByRegion(Region region);
    
    List<PhotoSpot> findByRegionId(Long regionId);
    
    List<PhotoSpot> findByWeatherScoreGreaterThanEqual(Integer minScore);
    
    @Query(value = "SELECT ps.* FROM photo_spots ps " +
           "LEFT JOIN (SELECT photo_spot_id, COUNT(*) as like_count " +
           "FROM posts p LEFT JOIN post_likes pl ON p.id = pl.post_id " +
           "GROUP BY photo_spot_id) likes ON ps.id = likes.photo_spot_id " +
           "ORDER BY COALESCE(likes.like_count, 0) DESC " +
           "LIMIT :limit", nativeQuery = true)
    List<PhotoSpot> findTopByOrderByLikesCountDesc(@Param("limit") int limit);
} 