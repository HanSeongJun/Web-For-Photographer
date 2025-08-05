package backend.WebFroPhto.controller;

import backend.WebFroPhto.dto.photospot.PhotoSpotDto;
import backend.WebFroPhto.service.PhotoSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/photospots")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class PhotoSpotController {

    @Autowired
    private PhotoSpotService photoSpotService;

    @GetMapping
    public ResponseEntity<List<PhotoSpotDto>> getAllPhotoSpots() {
        List<PhotoSpotDto> photoSpots = photoSpotService.getAllPhotoSpots();
        return ResponseEntity.ok(photoSpots);
    }

    @GetMapping("/{spotId}")
    public ResponseEntity<PhotoSpotDto> getPhotoSpot(@PathVariable Long spotId) {
        return photoSpotService.getPhotoSpotById(spotId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/region/{regionId}")
    public ResponseEntity<List<PhotoSpotDto>> getPhotoSpotsByRegion(@PathVariable Long regionId) {
        List<PhotoSpotDto> photoSpots = photoSpotService.getPhotoSpotsByRegion(regionId);
        return ResponseEntity.ok(photoSpots);
    }

    @GetMapping("/region/code/{regionCode}")
    public ResponseEntity<List<PhotoSpotDto>> getPhotoSpotsByRegionCode(@PathVariable String regionCode) {
        List<PhotoSpotDto> photoSpots = photoSpotService.getPhotoSpotsByRegionCode(regionCode);
        return ResponseEntity.ok(photoSpots);
    }

    @GetMapping("/best")
    public ResponseEntity<List<PhotoSpotDto>> getBestPhotoSpots(@RequestParam(defaultValue = "6") int limit) {
        List<PhotoSpotDto> bestPhotoSpots = photoSpotService.getBestPhotoSpots(limit);
        return ResponseEntity.ok(bestPhotoSpots);
    }

    @PostMapping
    public ResponseEntity<PhotoSpotDto> createPhotoSpot(@RequestBody PhotoSpotDto photoSpotDto) {
        PhotoSpotDto createdPhotoSpot = photoSpotService.createPhotoSpot(photoSpotDto);
        return ResponseEntity.ok(createdPhotoSpot);
    }

    @PutMapping("/{spotId}")
    public ResponseEntity<PhotoSpotDto> updatePhotoSpot(@PathVariable Long spotId, @RequestBody PhotoSpotDto photoSpotDto) {
        return photoSpotService.updatePhotoSpot(spotId, photoSpotDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{spotId}")
    public ResponseEntity<Void> deletePhotoSpot(@PathVariable Long spotId) {
        boolean deleted = photoSpotService.deletePhotoSpot(spotId);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
} 