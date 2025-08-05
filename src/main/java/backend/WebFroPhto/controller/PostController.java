package backend.WebFroPhto.controller;

import backend.WebFroPhto.dto.post.CreatePostRequest;
import backend.WebFroPhto.dto.post.PostDto;
import backend.WebFroPhto.entity.PhotoSpot;
import backend.WebFroPhto.entity.Post;
import backend.WebFroPhto.entity.PostLike;
import backend.WebFroPhto.entity.User;
import backend.WebFroPhto.repository.PhotoSpotRepository;
import backend.WebFroPhto.repository.PostLikeRepository;
import backend.WebFroPhto.repository.PostRepository;
import backend.WebFroPhto.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175"})
public class PostController {

    private final PostRepository postRepository;
    private final PhotoSpotRepository photoSpotRepository;
    private final PostLikeRepository postLikeRepository;
    private final UserRepository userRepository;

    @GetMapping("/spot/{spotId}/latest")
    public ResponseEntity<List<PostDto>> getLatestPosts(@PathVariable Long spotId) {
        List<Post> posts = postRepository.findByPhotoSpotIdOrderByCreatedAtDesc(spotId);
        List<PostDto> postDtos = posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        // 디버깅을 위한 로그 추가
        System.out.println("=== 최신 글 조회 ===");
        System.out.println("PhotoSpot ID: " + spotId);
        System.out.println("조회된 글 개수: " + postDtos.size());
        postDtos.forEach(post -> {
            System.out.println("글 ID: " + post.getId() + ", 제목: " + post.getTitle() + ", 작성일: " + post.getCreatedAt());
        });
        
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/spot/{spotId}/best")
    public ResponseEntity<List<PostDto>> getBestPosts(@PathVariable Long spotId) {
        List<Post> posts = postRepository.findByPhotoSpotIdOrderByLikesCountDesc(spotId);
        List<PostDto> postDtos = posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        // 디버깅을 위한 로그 추가
        System.out.println("=== 베스트 글 조회 ===");
        System.out.println("PhotoSpot ID: " + spotId);
        System.out.println("조회된 글 개수: " + postDtos.size());
        postDtos.forEach(post -> {
            System.out.println("글 ID: " + post.getId() + ", 제목: " + post.getTitle() + ", 좋아요 수: " + post.getLikesCount());
        });
        
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return ResponseEntity.ok(convertToDto(post));
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody CreatePostRequest request) {
        try {
            System.out.println("=== 게시글 생성 요청 ===");
            System.out.println("Request: " + request);
            System.out.println("Image URL length: " + (request.getImageUrl() != null ? request.getImageUrl().length() : 0));
            System.out.println("Image URL preview: " + (request.getImageUrl() != null ? request.getImageUrl().substring(0, Math.min(100, request.getImageUrl().length())) + "..." : "No image"));
            
            PhotoSpot photoSpot = photoSpotRepository.findById(request.getPhotoSpotId())
                    .orElseThrow(() -> new RuntimeException("Photo spot not found"));

            Post post = new Post();
            post.setTitle(request.getTitle());
            post.setContent(request.getContent());
            post.setAuthor(request.getAuthor());
            post.setImageUrl(request.getImageUrl());
            post.setPhotoSpot(photoSpot);
            post.setTags(request.getTags());

            Post savedPost = postRepository.save(post);
            System.out.println("게시글 생성 완료: " + savedPost.getId());
            
            return ResponseEntity.ok(convertToDto(savedPost));
        } catch (Exception e) {
            System.err.println("게시글 생성 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{postId}/like")
    @Transactional
    public ResponseEntity<PostDto> toggleLike(@PathVariable Long postId, @RequestParam Long userId) {
        try {
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 이미 좋아요를 눌렀는지 확인
            boolean alreadyLiked = postLikeRepository.existsByPostIdAndUserId(postId, userId);
            
            if (alreadyLiked) {
                // 좋아요 취소
                postLikeRepository.deleteByPostIdAndUserId(postId, userId);
            } else {
                // 좋아요 추가
                PostLike postLike = new PostLike();
                postLike.setPostId(postId);
                postLike.setUserId(userId);
                postLikeRepository.save(postLike);
            }

            // 업데이트된 게시글 정보 반환
            Post updatedPost = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            
            return ResponseEntity.ok(convertToDto(updatedPost));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/best")
    public ResponseEntity<List<PostDto>> getBestPosts(@RequestParam(defaultValue = "6") int limit) {
        List<Post> posts = postRepository.findTopByOrderByLikesCountDesc(limit);
        List<PostDto> postDtos = posts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/{postId}/like-status")
    public ResponseEntity<Boolean> getLikeStatus(@PathVariable Long postId, @RequestParam Long userId) {
        try {
            boolean isLiked = postLikeRepository.existsByPostIdAndUserId(postId, userId);
            return ResponseEntity.ok(isLiked);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(false);
        }
    }

    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAuthor(post.getAuthor());
        dto.setImageUrl(post.getImageUrl());
        
        // 좋아요 수를 PostLikeRepository를 통해 계산
        long likesCount = postLikeRepository.countByPostId(post.getId());
        dto.setLikesCount((int) likesCount);
        
        dto.setPhotoSpotId(post.getPhotoSpot().getId());
        dto.setTags(post.getTags());
        dto.setCreatedAt(post.getCreatedAt());
        return dto;
    }
} 