# 📊 WebForPhoto 클래스 다이어그램

## 🏗️ 백엔드 아키텍처

```mermaid
classDiagram
    %% Entity Classes
    class User {
        +Long id
        +String email
        +String password
        +String nickname
        +String role
        +String profileImageUrl
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +getLikesCount()
    }
    
    class Region {
        +Long id
        +String name
        +String code
        +String type
        +Long parentId
        +BigDecimal latitude
        +BigDecimal longitude
        +getPhotoSpotCount()
        +getWeatherGrade()
    }
    
    class PhotoSpot {
        +Long id
        +String name
        +String description
        +BigDecimal latitude
        +BigDecimal longitude
        +Long regionId
        +Integer weatherScore
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +getLikesCount()
    }
    
    class Post {
        +Long id
        +String title
        +String content
        +String author
        +String imageUrl
        +Long photoSpotId
        +List~String~ tags
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +getLikesCount()
    }
    
    class Comment {
        +Long id
        +String content
        +String author
        +Long authorId
        +Integer likesCount
        +Long postId
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        +getLikesCount()
    }
    
    class PostLike {
        +Long id
        +Long postId
        +Long userId
        +LocalDateTime createdAt
    }
    
    class WeatherData {
        +Long id
        +Long regionId
        +BigDecimal temperature
        +Integer humidity
        +BigDecimal windSpeed
        +String weatherCondition
        +Integer pm10
        +Integer pm25
        +String weatherGrade
        +LocalDateTime measuredAt
        +LocalDateTime createdAt
    }
    
    %% Controller Classes
    class AuthController {
        +UserService userService
        +JwtUtil jwtUtil
        +login(LoginRequest)
        +signup(SignUpRequest)
        +updateProfileImage()
    }
    
    class WeatherController {
        +WeatherService weatherService
        +getWeatherMap()
        +getWeatherGrade(String)
        +getDistrictWeather(String)
    }
    
    class PhotoSpotController {
        +PhotoSpotService photoSpotService
        +getAllPhotoSpots()
        +getPhotoSpot(Long)
        +getPhotoSpotsByRegion(Long)
        +getBestPhotoSpots()
    }
    
    class PostController {
        +PostService postService
        +PostRepository postRepository
        +PhotoSpotRepository photoSpotRepository
        +PostLikeRepository postLikeRepository
        +UserRepository userRepository
        +getLatestPosts(Long)
        +getBestPosts(Long)
        +getPost(Long)
        +createPost(CreatePostRequest)
        +toggleLike(Long, Long)
        +getBestPosts(int)
        +getLikeStatus(Long, Long)
    }
    
    class CommentController {
        +CommentService commentService
        +getCommentsByPost(Long)
        +createComment(CreateCommentRequest)
        +deleteComment(Long)
        +toggleLike(Long, Long)
    }
    
    class RegionController {
        +RegionService regionService
        +getAllRegions()
        +getRegionByCode(String)
    }
    
    %% Service Classes
    class UserService {
        +UserRepository userRepository
        +PasswordEncoder passwordEncoder
        +JwtUtil jwtUtil
        +register(SignUpRequest)
        +login(LoginRequest)
        +updateProfileImage()
        +findByEmail(String)
        +findById(Long)
    }
    
    class WeatherService {
        +WeatherDataRepository weatherDataRepository
        +RegionRepository regionRepository
        +getWeatherMap()
        +getWeatherGrade(String)
        +getDistrictWeather(String)
        +updateWeatherData()
        +calculateWeatherScore()
        +fetchWeatherData()
        +fetchAirQualityData()
    }
    
    class PhotoSpotService {
        +PhotoSpotRepository photoSpotRepository
        +RegionRepository regionRepository
        +getAllPhotoSpots()
        +getPhotoSpot(Long)
        +getPhotoSpotsByRegion(Long)
        +getBestPhotoSpots()
        +createPhotoSpot(PhotoSpotDto)
    }
    
    class PostService {
        +PostRepository postRepository
        +PhotoSpotRepository photoSpotRepository
        +UserRepository userRepository
        +PostLikeRepository postLikeRepository
        +getLatestPosts(Long)
        +getBestPosts(Long)
        +getPost(Long)
        +createPost(CreatePostRequest)
        +toggleLike(Long, Long)
        +getBestPosts(int)
    }
    
    class CommentService {
        +CommentRepository commentRepository
        +PostRepository postRepository
        +UserRepository userRepository
        +getCommentsByPost(Long)
        +createComment(CreateCommentRequest)
        +deleteComment(Long)
        +toggleLike(Long, Long)
    }
    
    class RegionService {
        +RegionRepository regionRepository
        +getAllRegions()
        +getRegionByCode(String)
        +getRegionsWithPhotoSpotCount()
        +getRegionsWithWeatherGrade()
    }
    
    %% Repository Classes
    class UserRepository {
        +findByEmail(String)
        +findById(Long)
        +save(User)
        +delete(User)
    }
    
    class RegionRepository {
        +findAll()
        +findByCode(String)
        +findById(Long)
        +save(Region)
    }
    
    class PhotoSpotRepository {
        +findAll()
        +findById(Long)
        +findByRegionId(Long)
        +findTopByOrderByWeatherScoreDesc(int)
        +save(PhotoSpot)
    }
    
    class PostRepository {
        +findAll()
        +findById(Long)
        +findByPhotoSpotIdOrderByCreatedAtDesc(Long)
        +findByPhotoSpotIdOrderByLikesCountDesc(Long)
        +findTopByOrderByLikesCountDesc(int)
        +save(Post)
    }
    
    class CommentRepository {
        +findByPostIdOrderByCreatedAtDesc(Long)
        +findById(Long)
        +save(Comment)
        +delete(Comment)
    }
    
    class PostLikeRepository {
        +findByPostId(Long)
        +existsByPostIdAndUserId(Long, Long)
        +countByPostId(Long)
        +deleteByPostIdAndUserId(Long, Long)
        +save(PostLike)
    }
    
    class WeatherDataRepository {
        +findByRegionId(Long)
        +findByRegionIdOrderByMeasuredAtDesc(Long)
        +save(WeatherData)
    }
    
    %% DTO Classes
    class LoginRequest {
        +String email
        +String password
    }
    
    class SignUpRequest {
        +String email
        +String password
        +String nickname
    }
    
    class AuthResponse {
        +String token
        +UserDto user
    }
    
    class CreatePostRequest {
        +String title
        +String content
        +String author
        +String imageUrl
        +Long photoSpotId
        +List~String~ tags
    }
    
    class PostDto {
        +Long id
        +String title
        +String content
        +String author
        +String imageUrl
        +Integer likesCount
        +Long photoSpotId
        +String photoSpotName
        +List~String~ tags
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }
    
    class CreateCommentRequest {
        +String content
        +String author
        +Long authorId
        +Long postId
    }
    
    class CommentDto {
        +Long id
        +String content
        +String author
        +Long authorId
        +Integer likesCount
        +Long postId
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }
    
    class PhotoSpotDto {
        +Long id
        +String name
        +String description
        +BigDecimal latitude
        +BigDecimal longitude
        +Long regionId
        +String regionName
        +Integer weatherScore
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
    }
    
    class WeatherDto {
        +String regionCode
        +String grade
        +Integer score
        +WeatherForecastDto weather
        +AirQualityDto airQuality
        +String dataTime
    }
    
    class WeatherForecastDto {
        +BigDecimal temperature
        +Integer humidity
        +BigDecimal windSpeed
        +Integer cloudCover
        +Integer visibility
    }
    
    class AirQualityDto {
        +Integer pm10
        +String pm10Grade
        +Integer pm25
        +String pm25Grade
    }
    
    %% Configuration Classes
    class SecurityConfig {
        +configure(HttpSecurity)
        +passwordEncoder()
        +corsConfigurationSource()
    }
    
    class JwtUtil {
        +String secret
        +generateToken(String)
        +validateToken(String)
        +extractEmail(String)
    }
    
    class SchedulingConfig {
        +taskExecutor()
        +scheduledTaskExecutor()
    }
    
    %% Relationships
    %% Controllers -> Services
    AuthController --> UserService
    WeatherController --> WeatherService
    PhotoSpotController --> PhotoSpotService
    PostController --> PostService
    CommentController --> CommentService
    RegionController --> RegionService
    
    %% Services -> Repositories
    UserService --> UserRepository
    WeatherService --> WeatherDataRepository
    WeatherService --> RegionRepository
    PhotoSpotService --> PhotoSpotRepository
    PhotoSpotService --> RegionRepository
    PostService --> PostRepository
    PostService --> PhotoSpotRepository
    PostService --> UserRepository
    PostService --> PostLikeRepository
    CommentService --> CommentRepository
    CommentService --> PostRepository
    CommentService --> UserRepository
    RegionService --> RegionRepository
    
    %% Entity Relationships
    User ||--o{ Post : "작성"
    User ||--o{ Comment : "작성"
    User ||--o{ PostLike : "좋아요"
    Region ||--o{ PhotoSpot : "소속"
    Region ||--o{ WeatherData : "날씨정보"
    PhotoSpot ||--o{ Post : "게시글"
    Post ||--o{ Comment : "댓글"
    Post ||--o{ PostLike : "좋아요"
    
    %% DTOs
    AuthController --> LoginRequest
    AuthController --> SignUpRequest
    AuthController --> AuthResponse
    PostController --> CreatePostRequest
    PostController --> PostDto
    CommentController --> CreateCommentRequest
    CommentController --> CommentDto
    PhotoSpotController --> PhotoSpotDto
    WeatherController --> WeatherDto
    WeatherController --> WeatherForecastDto
    WeatherController --> AirQualityDto
```

## 🎯 주요 특징

### 📋 계층 구조
- **Controller Layer**: REST API 엔드포인트 제공
- **Service Layer**: 비즈니스 로직 처리
- **Repository Layer**: 데이터 접근 계층
- **Entity Layer**: 데이터베이스 엔티티

### 🔄 의존성 관계
- Controller → Service → Repository
- Entity 간의 관계 (One-to-Many, Many-to-Many)
- DTO를 통한 데이터 전송

### 🛡️ 보안
- JWT 기반 인증
- Spring Security 설정
- CORS 설정

### 📊 데이터 흐름
1. **요청**: Client → Controller
2. **검증**: Controller → Service
3. **처리**: Service → Repository
4. **응답**: Repository → Service → Controller → Client 