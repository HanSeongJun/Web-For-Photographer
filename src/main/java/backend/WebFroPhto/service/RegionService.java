package backend.WebFroPhto.service;

import backend.WebFroPhto.entity.Region;
import backend.WebFroPhto.repository.RegionRepository;
import backend.WebFroPhto.dto.region.RegionDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegionService {

    @Autowired
    private RegionRepository regionRepository;

    public List<RegionDto> getAllRegions() {
        return regionRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<RegionDto> getRegionById(Long id) {
        return regionRepository.findById(id)
                .map(this::convertToDto);
    }

    public Optional<RegionDto> getRegionByCode(String code) {
        return regionRepository.findByCode(code)
                .map(this::convertToDto);
    }

    public List<RegionDto> getRegionsByType(String type) {
        return regionRepository.findByType(type).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<RegionDto> getRegionsByParentId(Long parentId) {
        return regionRepository.findByParentId(parentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public RegionDto createRegion(RegionDto regionDto) {
        Region region = new Region();
        region.setName(regionDto.getName());
        region.setCode(regionDto.getCode());
        region.setType(regionDto.getType());
        region.setLatitude(regionDto.getLatitude());
        region.setLongitude(regionDto.getLongitude());

        if (regionDto.getParentId() != null) {
            region.setParentId(regionDto.getParentId());
        }

        Region savedRegion = regionRepository.save(region);
        return convertToDto(savedRegion);
    }

    public Optional<RegionDto> updateRegion(Long id, RegionDto regionDto) {
        return regionRepository.findById(id).map(region -> {
            region.setName(regionDto.getName());
            region.setCode(regionDto.getCode());
            region.setType(regionDto.getType());
            region.setLatitude(regionDto.getLatitude());
            region.setLongitude(regionDto.getLongitude());

            if (regionDto.getParentId() != null) {
                region.setParentId(regionDto.getParentId());
            }

            Region savedRegion = regionRepository.save(region);
            return convertToDto(savedRegion);
        });
    }

    public boolean deleteRegion(Long id) {
        if (regionRepository.existsById(id)) {
            regionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private RegionDto convertToDto(Region region) {
        RegionDto dto = new RegionDto();
        dto.setId(region.getId());
        dto.setName(region.getName());
        dto.setCode(region.getCode());
        dto.setType(region.getType());
        dto.setLatitude(region.getLatitude());
        dto.setLongitude(region.getLongitude());
        
        if (region.getParentId() != null) {
            dto.setParentId(region.getParentId());
            // 부모 지역 정보는 별도로 조회해야 함
        }
        
        return dto;
    }
} 
 
 
 
 
 