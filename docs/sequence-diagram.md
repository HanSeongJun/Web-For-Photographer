# 📊 WebForPhoto 시퀀스 다이어그램

## 🔐 사용자 인증 시퀀스

### 로그인 프로세스
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant AuthController as AuthController
    participant UserService as UserService
    participant UserRepository as UserRepository
    participant JwtUtil as JwtUtil
    participant DB as Database

    Client->>AuthController: POST /api/auth/login
    Note over Client,AuthController: {email, password}
    
    AuthController->>UserService: login(LoginRequest)
    UserService->>UserRepository: findByEmail(email)
    UserRepository->>DB: SELECT * FROM users WHERE email = ?
    DB-->>UserRepository: User entity
    UserRepository-->>UserService: User object
    
    UserService->>UserService: validatePassword(password, user.password)
    alt 비밀번호 일치
        UserService->>JwtUtil: generateToken(user.email)
        JwtUtil-->>UserService: JWT token
        UserService-->>AuthController: AuthResponse(token, user)
        AuthController-->>Client: 200 OK + {token, user}
    else 비밀번호 불일치
        UserService-->>AuthController: AuthenticationException
        AuthController-->>Client: 401 Unauthorized
    end
```

### 회원가입 프로세스
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant AuthController as AuthController
    participant UserService as UserService
    participant UserRepository as UserRepository
    participant PasswordEncoder as PasswordEncoder
    participant DB as Database

    Client->>AuthController: POST /api/auth/signup
    Note over Client,AuthController: {email, password, nickname}
    
    AuthController->>UserService: register(SignUpRequest)
    UserService->>UserRepository: findByEmail(email)
    UserRepository->>DB: SELECT * FROM users WHERE email = ?
    DB-->>UserRepository: null (사용자 없음)
    UserRepository-->>UserService: null
    
    UserService->>PasswordEncoder: encode(password)
    PasswordEncoder-->>UserService: encodedPassword
    
    UserService->>UserService: createUser(email, encodedPassword, nickname)
    UserService->>UserRepository: save(user)
    UserRepository->>DB: INSERT INTO users (...)
    DB-->>UserRepository: saved user
    UserRepository-->>UserService: User object
    
    UserService-->>AuthController: User object
    AuthController-->>Client: 201 Created + {message: "회원가입 성공"}
```

## 📝 게시글 작성 시퀀스

### 게시글 생성 프로세스
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant PostController as PostController
    participant PostService as PostService
    participant PhotoSpotRepository as PhotoSpotRepository
    participant PostRepository as PostRepository
    participant DB as Database

    Client->>PostController: POST /api/posts
    Note over Client,PostController: {title, content, author, imageUrl, photoSpotId, tags}
    
    PostController->>PostController: validate request
    PostController->>PhotoSpotRepository: findById(photoSpotId)
    PhotoSpotRepository->>DB: SELECT * FROM photo_spots WHERE id = ?
    DB-->>PhotoSpotRepository: PhotoSpot entity
    PhotoSpotRepository-->>PostController: PhotoSpot object
    
    PostController->>PostService: createPost(CreatePostRequest)
    PostService->>PostService: validate data
    PostService->>PostService: create Post entity
    PostService->>PostRepository: save(post)
    PostRepository->>DB: INSERT INTO posts (...)
    DB-->>PostRepository: saved post
    PostRepository-->>PostService: Post object
    
    PostService->>PostService: convertToDto(post)
    PostService-->>PostController: PostDto
    PostController-->>Client: 200 OK + PostDto
```

### 게시글 좋아요 토글 프로세스
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant PostController as PostController
    participant PostLikeRepository as PostLikeRepository
    participant UserRepository as UserRepository
    participant DB as Database

    Client->>PostController: POST /api/posts/{postId}/like?userId={userId}
    
    PostController->>PostLikeRepository: existsByPostIdAndUserId(postId, userId)
    PostLikeRepository->>DB: SELECT COUNT(*) FROM post_likes WHERE post_id = ? AND user_id = ?
    DB-->>PostLikeRepository: count
    
    alt 이미 좋아요를 눌렀음 (count > 0)
        PostController->>PostLikeRepository: deleteByPostIdAndUserId(postId, userId)
        PostLikeRepository->>DB: DELETE FROM post_likes WHERE post_id = ? AND user_id = ?
        DB-->>PostLikeRepository: deleted
        Note over PostController: 좋아요 취소
    else 좋아요를 누르지 않음 (count = 0)
        PostController->>PostController: create PostLike entity
        PostController->>PostLikeRepository: save(postLike)
        PostLikeRepository->>DB: INSERT INTO post_likes (...)
        DB-->>PostLikeRepository: saved
        Note over PostController: 좋아요 추가
    end
    
    PostController->>PostLikeRepository: countByPostId(postId)
    PostLikeRepository->>DB: SELECT COUNT(*) FROM post_likes WHERE post_id = ?
    DB-->>PostLikeRepository: updated count
    PostLikeRepository-->>PostController: count
    
    PostController-->>Client: 200 OK + updated PostDto
```

## 🌤️ 날씨 정보 조회 시퀀스

### 날씨 지도 데이터 조회
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant WeatherController as WeatherController
    participant WeatherService as WeatherService
    participant WeatherDataRepository as WeatherDataRepository
    participant RegionRepository as RegionRepository
    participant ExternalAPI as 기상청 API
    participant DB as Database

    Client->>WeatherController: GET /api/weather/map
    
    WeatherController->>WeatherService: getWeatherMap()
    WeatherService->>RegionRepository: findAll()
    RegionRepository->>DB: SELECT * FROM regions WHERE type = '시도'
    DB-->>RegionRepository: List of regions
    RegionRepository-->>WeatherService: List<Region>
    
    loop 각 지역별로
        WeatherService->>WeatherDataRepository: findByRegionIdOrderByMeasuredAtDesc(regionId)
        WeatherDataRepository->>DB: SELECT * FROM weather_data WHERE region_id = ? ORDER BY measured_at DESC LIMIT 1
        DB-->>WeatherDataRepository: WeatherData
        WeatherDataRepository-->>WeatherService: WeatherData
        
        alt 최신 데이터가 없거나 오래된 경우
            WeatherService->>ExternalAPI: fetchWeatherData(regionCode)
            ExternalAPI-->>WeatherService: weather data
            WeatherService->>ExternalAPI: fetchAirQualityData(regionCode)
            ExternalAPI-->>WeatherService: air quality data
            WeatherService->>WeatherService: calculateWeatherScore()
            WeatherService->>WeatherDataRepository: save(weatherData)
            WeatherDataRepository->>DB: INSERT INTO weather_data (...)
        end
    end
    
    WeatherService->>WeatherService: convertToWeatherMap()
    WeatherService-->>WeatherController: Map<String, WeatherDto>
    WeatherController-->>Client: 200 OK + weather map data
```

### 지역별 상세 날씨 조회
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant WeatherController as WeatherController
    participant WeatherService as WeatherService
    participant RegionRepository as RegionRepository
    participant WeatherDataRepository as WeatherDataRepository
    participant ExternalAPI as 기상청 API
    participant DB as Database

    Client->>WeatherController: GET /api/weather/grade/{regionCode}
    
    WeatherController->>WeatherService: getWeatherGrade(regionCode)
    WeatherService->>RegionRepository: findByCode(regionCode)
    RegionRepository->>DB: SELECT * FROM regions WHERE code = ?
    DB-->>RegionRepository: Region
    RegionRepository-->>WeatherService: Region
    
    WeatherService->>WeatherDataRepository: findByRegionIdOrderByMeasuredAtDesc(regionId)
    WeatherDataRepository->>DB: SELECT * FROM weather_data WHERE region_id = ? ORDER BY measured_at DESC LIMIT 1
    DB-->>WeatherDataRepository: WeatherData
    WeatherDataRepository-->>WeatherService: WeatherData
    
    alt 데이터가 없거나 오래된 경우
        WeatherService->>ExternalAPI: fetchWeatherData(regionCode)
        ExternalAPI-->>WeatherService: weather forecast data
        WeatherService->>ExternalAPI: fetchAirQualityData(regionCode)
        ExternalAPI-->>WeatherService: air quality data
        WeatherService->>WeatherService: calculateWeatherScore()
        WeatherService->>WeatherDataRepository: save(weatherData)
        WeatherDataRepository->>DB: INSERT INTO weather_data (...)
    end
    
    WeatherService->>WeatherService: convertToWeatherDto()
    WeatherService-->>WeatherController: WeatherDto
    WeatherController-->>Client: 200 OK + WeatherDto
```

## 📍 포토스팟 조회 시퀀스

### 포토스팟 목록 조회
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant PhotoSpotController as PhotoSpotController
    participant PhotoSpotService as PhotoSpotService
    participant PhotoSpotRepository as PhotoSpotRepository
    participant RegionRepository as RegionRepository
    participant DB as Database

    Client->>PhotoSpotController: GET /api/photospots
    
    PhotoSpotController->>PhotoSpotService: getAllPhotoSpots()
    PhotoSpotService->>PhotoSpotRepository: findAll()
    PhotoSpotRepository->>DB: SELECT * FROM photo_spots
    DB-->>PhotoSpotRepository: List of photo spots
    PhotoSpotRepository-->>PhotoSpotService: List<PhotoSpot>
    
    loop 각 포토스팟별로
        PhotoSpotService->>RegionRepository: findById(regionId)
        RegionRepository->>DB: SELECT * FROM regions WHERE id = ?
        DB-->>RegionRepository: Region
        RegionRepository-->>PhotoSpotService: Region
        PhotoSpotService->>PhotoSpotService: convertToDto(photoSpot, region)
    end
    
    PhotoSpotService-->>PhotoSpotController: List<PhotoSpotDto>
    PhotoSpotController-->>Client: 200 OK + photo spots list
```

### 포토스팟별 게시글 조회
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant PostController as PostController
    participant PostRepository as PostRepository
    participant PostLikeRepository as PostLikeRepository
    participant DB as Database

    Client->>PostController: GET /api/posts/spot/{spotId}/latest
    
    PostController->>PostRepository: findByPhotoSpotIdOrderByCreatedAtDesc(spotId)
    PostRepository->>DB: SELECT * FROM posts WHERE photo_spot_id = ? ORDER BY created_at DESC
    DB-->>PostRepository: List of posts
    PostRepository-->>PostController: List<Post>
    
    loop 각 게시글별로
        PostController->>PostLikeRepository: countByPostId(postId)
        PostLikeRepository->>DB: SELECT COUNT(*) FROM post_likes WHERE post_id = ?
        DB-->>PostLikeRepository: likes count
        PostLikeRepository-->>PostController: count
        PostController->>PostController: convertToDto(post, likesCount)
    end
    
    PostController-->>Client: 200 OK + posts list with likes count
```

## 💬 댓글 시스템 시퀀스

### 댓글 작성
```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant CommentController as CommentController
    participant CommentService as CommentService
    participant CommentRepository as CommentRepository
    participant PostRepository as PostRepository
    participant UserRepository as UserRepository
    participant DB as Database

    Client->>CommentController: POST /api/comments
    Note over Client,CommentController: {content, author, authorId, postId}
    
    CommentController->>CommentService: createComment(CreateCommentRequest)
    CommentService->>PostRepository: findById(postId)
    PostRepository->>DB: SELECT * FROM posts WHERE id = ?
    DB-->>PostRepository: Post
    PostRepository-->>CommentService: Post
    
    CommentService->>UserRepository: findById(authorId)
    UserRepository->>DB: SELECT * FROM users WHERE id = ?
    DB-->>UserRepository: User
    UserRepository-->>CommentService: User
    
    CommentService->>CommentService: create Comment entity
    CommentService->>CommentRepository: save(comment)
    CommentRepository->>DB: INSERT INTO comments (...)
    DB-->>CommentRepository: saved comment
    CommentRepository-->>CommentService: Comment
    
    CommentService->>CommentService: convertToDto(comment)
    CommentService-->>CommentController: CommentDto
    CommentController-->>Client: 201 Created + CommentDto
```

## 🔄 자동 날씨 데이터 업데이트 시퀀스

### 스케줄된 날씨 데이터 갱신
```mermaid
sequenceDiagram
    participant Scheduler as @Scheduled
    participant WeatherService as WeatherService
    participant RegionRepository as RegionRepository
    participant ExternalAPI as 기상청 API
    participant WeatherDataRepository as WeatherDataRepository
    participant DB as Database

    Note over Scheduler: 매 10분마다 실행
    
    Scheduler->>WeatherService: updateWeatherData()
    WeatherService->>RegionRepository: findAll()
    RegionRepository->>DB: SELECT * FROM regions WHERE type = '시도'
    DB-->>RegionRepository: List of regions
    RegionRepository-->>WeatherService: List<Region>
    
    loop 각 지역별로
        WeatherService->>ExternalAPI: fetchWeatherData(regionCode)
        ExternalAPI-->>WeatherService: weather forecast data
        WeatherService->>ExternalAPI: fetchAirQualityData(regionCode)
        ExternalAPI-->>WeatherService: air quality data
        WeatherService->>WeatherService: calculateWeatherScore()
        WeatherService->>WeatherDataRepository: save(weatherData)
        WeatherDataRepository->>DB: INSERT INTO weather_data (...)
        DB-->>WeatherDataRepository: saved
    end
    
    Note over WeatherService: 캐시 업데이트 완료
```

## 🎯 주요 특징

### 📊 데이터 흐름
1. **요청 처리**: Client → Controller → Service → Repository → Database
2. **응답 반환**: Database → Repository → Service → Controller → Client
3. **외부 API 연동**: Service → External API → Service
4. **자동 스케줄링**: Scheduler → Service → External API → Database

### 🔄 비동기 처리
- **날씨 데이터 갱신**: 10분마다 자동 실행
- **외부 API 호출**: 비동기 처리로 성능 최적화
- **캐싱 시스템**: 데이터베이스 캐시 활용

### 🛡️ 보안 처리
- **JWT 토큰 검증**: 모든 인증이 필요한 요청에서
- **입력 데이터 검증**: Controller 레벨에서 요청 데이터 검증
- **예외 처리**: 각 계층에서 적절한 예외 처리

### 📈 성능 최적화
- **데이터베이스 인덱싱**: 자주 조회되는 컬럼에 인덱스 적용
- **N+1 문제 해결**: JPA fetch join 활용
- **캐싱**: 날씨 데이터 캐싱으로 API 호출 최소화 