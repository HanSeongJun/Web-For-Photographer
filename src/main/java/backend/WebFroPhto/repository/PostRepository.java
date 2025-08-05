package backend.WebFroPhto.repository;

import backend.WebFroPhto.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    @Query("SELECT p FROM Post p WHERE p.photoSpot.id = :photoSpotId ORDER BY p.createdAt DESC")
    List<Post> findByPhotoSpotIdOrderByCreatedAtDesc(@Param("photoSpotId") Long photoSpotId);
    
    @Query(value = "SELECT p.* FROM posts p " +
           "LEFT JOIN (SELECT post_id, COUNT(*) as like_count FROM post_likes GROUP BY post_id) pl ON p.id = pl.post_id " +
           "WHERE p.photo_spot_id = :photoSpotId " +
           "ORDER BY COALESCE(pl.like_count, 0) DESC, p.created_at DESC", nativeQuery = true)
    List<Post> findByPhotoSpotIdOrderByLikesCountDesc(@Param("photoSpotId") Long photoSpotId);
    
    @Query(value = "SELECT p.* FROM posts p " +
           "LEFT JOIN (SELECT post_id, COUNT(*) as like_count FROM post_likes GROUP BY post_id) pl ON p.id = pl.post_id " +
           "ORDER BY COALESCE(pl.like_count, 0) DESC, p.created_at DESC " +
           "LIMIT :limit", nativeQuery = true)
    List<Post> findTopByOrderByLikesCountDesc(@Param("limit") int limit);
    
    List<Post> findByPhotoSpotId(Long photoSpotId);
} 