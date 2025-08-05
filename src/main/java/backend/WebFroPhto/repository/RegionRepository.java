package backend.WebFroPhto.repository;

import backend.WebFroPhto.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RegionRepository extends JpaRepository<Region, Long> {
    
    Optional<Region> findByCode(String code);
    
    List<Region> findByType(String type);
    
    List<Region> findByParentId(Long parentId);
} 