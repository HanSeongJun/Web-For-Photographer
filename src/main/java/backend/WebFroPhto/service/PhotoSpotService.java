package backend.WebFroPhto.service;

import backend.WebFroPhto.entity.PhotoSpot;
import backend.WebFroPhto.entity.Region;
import backend.WebFroPhto.repository.PhotoSpotRepository;
import backend.WebFroPhto.repository.RegionRepository;
import backend.WebFroPhto.dto.photospot.PhotoSpotDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PhotoSpotService {

    @Autowired
    private PhotoSpotRepository photoSpotRepository;

    @Autowired
    private RegionRepository regionRepository;

    public List<PhotoSpotDto> getAllPhotoSpots() {
        return photoSpotRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Optional<PhotoSpotDto> getPhotoSpotById(Long id) {
        return photoSpotRepository.findById(id)
                .map(this::convertToDto);
    }

    public List<PhotoSpotDto> getPhotoSpotsByRegion(Long regionId) {
        return photoSpotRepository.findByRegionId(regionId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<PhotoSpotDto> getPhotoSpotsByRegionCode(String regionCode) {
        // regionCode로 Region을 찾고, 해당 Region의 ID로 포토스팟을 조회
        Optional<Region> region = regionRepository.findByCode(regionCode);
        if (region.isPresent()) {
            return photoSpotRepository.findByRegionId(region.get().getId()).stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    public PhotoSpotDto createPhotoSpot(PhotoSpotDto photoSpotDto) {
        PhotoSpot photoSpot = new PhotoSpot();
        photoSpot.setName(photoSpotDto.getName());
        photoSpot.setDescription(photoSpotDto.getDescription());
        photoSpot.setLatitude(photoSpotDto.getLatitude());
        photoSpot.setLongitude(photoSpotDto.getLongitude());
        photoSpot.setWeatherScore(photoSpotDto.getWeatherScore());
        photoSpot.setCreatedAt(LocalDateTime.now());
        photoSpot.setUpdatedAt(LocalDateTime.now());

        if (photoSpotDto.getRegionId() != null) {
            Optional<Region> region = regionRepository.findById(photoSpotDto.getRegionId());
            region.ifPresent(photoSpot::setRegion);
        }

        PhotoSpot savedPhotoSpot = photoSpotRepository.save(photoSpot);
        return convertToDto(savedPhotoSpot);
    }

    public Optional<PhotoSpotDto> updatePhotoSpot(Long id, PhotoSpotDto photoSpotDto) {
        return photoSpotRepository.findById(id).map(photoSpot -> {
            photoSpot.setName(photoSpotDto.getName());
            photoSpot.setDescription(photoSpotDto.getDescription());
            photoSpot.setLatitude(photoSpotDto.getLatitude());
            photoSpot.setLongitude(photoSpotDto.getLongitude());
            photoSpot.setWeatherScore(photoSpotDto.getWeatherScore());
            photoSpot.setUpdatedAt(LocalDateTime.now());

            if (photoSpotDto.getRegionId() != null) {
                Optional<Region> region = regionRepository.findById(photoSpotDto.getRegionId());
                region.ifPresent(photoSpot::setRegion);
            }

            PhotoSpot savedPhotoSpot = photoSpotRepository.save(photoSpot);
            return convertToDto(savedPhotoSpot);
        });
    }

    public List<PhotoSpotDto> getBestPhotoSpots(int limit) {
        return photoSpotRepository.findTopByOrderByLikesCountDesc(limit).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public boolean deletePhotoSpot(Long id) {
        if (photoSpotRepository.existsById(id)) {
            photoSpotRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private PhotoSpotDto convertToDto(PhotoSpot photoSpot) {
        PhotoSpotDto dto = new PhotoSpotDto();
        dto.setId(photoSpot.getId());
        dto.setName(photoSpot.getName());
        dto.setDescription(photoSpot.getDescription());
        dto.setLatitude(photoSpot.getLatitude());
        dto.setLongitude(photoSpot.getLongitude());
        dto.setWeatherScore(photoSpot.getWeatherScore());
        dto.setImageUrl(photoSpot.getImageUrl());
        dto.setCreatedAt(photoSpot.getCreatedAt());
        dto.setUpdatedAt(photoSpot.getUpdatedAt());
        
        if (photoSpot.getRegion() != null) {
            dto.setRegionId(photoSpot.getRegion().getId());
            dto.setRegionName(photoSpot.getRegion().getName());
        }
        
        return dto;
    }
} 