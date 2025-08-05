# 🎨 WebForPhoto 프론트엔드 컴포넌트 다이어그램

## 🏗️ React 컴포넌트 아키텍처

```mermaid
graph TB
    %% Main App Structure
    App[App.tsx] --> Router[BrowserRouter]
    Router --> AuthProvider[AuthProvider]
    AuthProvider --> Routes[Routes]
    
    %% Route Components
    Routes --> Home[Home.tsx]
    Routes --> Login[Login.tsx]
    Routes --> SignUp[SignUp.tsx]
    Routes --> Map[Map.tsx]
    Routes --> Weather[Weather.tsx]
    Routes --> PhotoSpots[PhotoSpots.tsx]
    Routes --> PhotoSpotDetail[PhotoSpotDetail.tsx]
    Routes --> WritePost[WritePost.tsx]
    Routes --> PostDetail[PostDetail.tsx]
    Routes --> Best[Best.tsx]
    Routes --> MyPage[MyPage.tsx]
    
    %% Shared Components
    App --> Header[Header.tsx]
    App --> WeatherMap[WeatherMap.tsx]
    
    %% Component Dependencies
    Header --> AuthContext[AuthContext]
    PhotoSpots --> PhotoSpotCard[PhotoSpotCard]
    PhotoSpotDetail --> PostList[PostList]
    WritePost --> ImageUpload[ImageUpload]
    PostDetail --> CommentList[CommentList]
    Best --> PostCard[PostCard]
    
    %% Context and Services
    AuthProvider --> AuthContext
    AuthContext --> ApiService[ApiService]
    ApiService --> ApiClient[Axios Client]
    
    %% Utility Functions
    ApiService --> ImageUtils[ImageUtils]
    ApiService --> AuthUtils[AuthUtils]
    
    %% Styling
    App --> TailwindCSS[Tailwind CSS]
    WeatherMap --> SVGMaps[SVG Maps]
    
    %% External Dependencies
    ApiClient --> BackendAPI[Backend API]
    SVGMaps --> KoreaMap[Korea Map Data]
    
    %% Styling
    classDef page fill:#e1f5fe
    classDef component fill:#f3e5f5
    classDef context fill:#e8f5e8
    classDef service fill:#fff3e0
    classDef external fill:#fce4ec
    
    class Home,Login,SignUp,Map,Weather,PhotoSpots,PhotoSpotDetail,WritePost,PostDetail,Best,MyPage page
    class Header,WeatherMap,PhotoSpotCard,PostList,ImageUpload,CommentList,PostCard component
    class AuthContext,AuthProvider context
    class ApiService,ImageUtils,AuthUtils service
    class BackendAPI,KoreaMap,TailwindCSS external
```

## 📱 페이지 컴포넌트 구조

### 🏠 홈페이지 (Home.tsx)
```mermaid
graph LR
    Home[Home.tsx] --> HeroSection[Hero Section]
    Home --> FeatureSection[Feature Section]
    Home --> WeatherPreview[Weather Preview]
    Home --> PhotoSpotPreview[Photo Spot Preview]
    
    HeroSection --> CTAButton[CTA Button]
    FeatureSection --> FeatureCard[Feature Card]
    WeatherPreview --> WeatherCard[Weather Card]
    PhotoSpotPreview --> PhotoSpotCard[Photo Spot Card]
```

### 🗺️ 날씨 지도 (Map.tsx)
```mermaid
graph LR
    Map[Map.tsx] --> WeatherMap[WeatherMap.tsx]
    WeatherMap --> SVGKoreaMap[SVG Korea Map]
    WeatherMap --> RegionTooltip[Region Tooltip]
    WeatherMap --> WeatherInfo[Weather Info Panel]
    
    SVGKoreaMap --> RegionPath[Region Path]
    RegionTooltip --> WeatherGrade[Weather Grade]
    WeatherInfo --> AirQualityInfo[Air Quality Info]
    WeatherInfo --> ForecastInfo[Forecast Info]
```

### 📍 포토스팟 목록 (PhotoSpots.tsx)
```mermaid
graph LR
    PhotoSpots[PhotoSpots.tsx] --> FilterSection[Filter Section]
    PhotoSpots --> PhotoSpotGrid[Photo Spot Grid]
    PhotoSpots --> Pagination[Pagination]
    
    FilterSection --> RegionFilter[Region Filter]
    FilterSection --> SearchFilter[Search Filter]
    PhotoSpotGrid --> PhotoSpotCard[Photo Spot Card]
    PhotoSpotCard --> PhotoSpotImage[Photo Spot Image]
    PhotoSpotCard --> PhotoSpotInfo[Photo Spot Info]
```

### 📝 게시글 작성 (WritePost.tsx)
```mermaid
graph LR
    WritePost[WritePost.tsx] --> Form[Form]
    Form --> TitleInput[Title Input]
    Form --> ContentInput[Content Input]
    Form --> ImageUpload[Image Upload]
    Form --> TagInput[Tag Input]
    Form --> SubmitButton[Submit Button]
    
    ImageUpload --> FileInput[File Input]
    ImageUpload --> ImagePreview[Image Preview]
    TagInput --> TagChip[Tag Chip]
```

## 🔧 컴포넌트 상세 구조

### 🎯 Header 컴포넌트
```mermaid
graph LR
    Header[Header.tsx] --> Logo[Logo]
    Header --> Navigation[Navigation]
    Header --> UserMenu[User Menu]
    
    Navigation --> NavLink[Nav Link]
    UserMenu --> LoginButton[Login Button]
    UserMenu --> ProfileMenu[Profile Menu]
    ProfileMenu --> LogoutButton[Logout Button]
    ProfileMenu --> MyPageLink[My Page Link]
```

### 🌤️ WeatherMap 컴포넌트
```mermaid
graph LR
    WeatherMap[WeatherMap.tsx] --> MapContainer[Map Container]
    MapContainer --> SVGKoreaMap[SVG Korea Map]
    SVGKoreaMap --> RegionPath[Region Path]
    
    WeatherMap --> WeatherPanel[Weather Panel]
    WeatherPanel --> CurrentWeather[Current Weather]
    WeatherPanel --> AirQuality[Air Quality]
    WeatherPanel --> Forecast[Forecast]
    
    WeatherMap --> DistrictDetail[District Detail]
    DistrictDetail --> DistrictWeather[District Weather]
    DistrictDetail --> DistrictAirQuality[District Air Quality]
```

### 📊 데이터 흐름

#### 🔐 인증 플로우
```mermaid
sequenceDiagram
    participant User as 사용자
    participant Login as Login.tsx
    participant AuthContext as AuthContext
    participant ApiService as ApiService
    participant Backend as Backend API

    User->>Login: 입력 (email, password)
    Login->>ApiService: login(email, password)
    ApiService->>Backend: POST /api/auth/login
    Backend-->>ApiService: JWT token + user data
    ApiService-->>Login: AuthResponse
    Login->>AuthContext: setUser(user)
    AuthContext->>AuthContext: setToken(token)
    AuthContext-->>Login: 인증 완료
    Login-->>User: 홈페이지로 리다이렉트
```

#### 📝 게시글 작성 플로우
```mermaid
sequenceDiagram
    participant User as 사용자
    participant WritePost as WritePost.tsx
    participant ImageUtils as ImageUtils
    participant ApiService as ApiService
    participant Backend as Backend API

    User->>WritePost: 이미지 선택
    WritePost->>ImageUtils: handleImageChange(file)
    ImageUtils->>ImageUtils: validateImageSize(file)
    ImageUtils->>ImageUtils: convertToBase64(file)
    ImageUtils-->>WritePost: imagePreview

    User->>WritePost: 폼 작성 및 제출
    WritePost->>WritePost: validateForm()
    WritePost->>ApiService: createPost(postData)
    ApiService->>Backend: POST /api/posts
    Backend-->>ApiService: PostDto
    ApiService-->>WritePost: 성공 응답
    WritePost-->>User: 성공 메시지 및 리다이렉트
```

#### 🌤️ 날씨 데이터 로딩 플로우
```mermaid
sequenceDiagram
    participant WeatherMap as WeatherMap.tsx
    participant ApiService as ApiService
    participant Backend as Backend API
    participant ExternalAPI as 기상청 API

    WeatherMap->>WeatherMap: useEffect()
    WeatherMap->>ApiService: getWeatherMap()
    ApiService->>Backend: GET /api/weather/map
    Backend->>ExternalAPI: fetchWeatherData()
    ExternalAPI-->>Backend: weather data
    Backend->>ExternalAPI: fetchAirQualityData()
    ExternalAPI-->>Backend: air quality data
    Backend->>Backend: calculateWeatherScore()
    Backend-->>ApiService: weather map data
    ApiService-->>WeatherMap: weather data
    WeatherMap->>WeatherMap: updateMapColors()
    WeatherMap->>WeatherMap: renderWeatherInfo()
```

## 🎨 스타일링 구조

### 🎨 Tailwind CSS 클래스 구조
```mermaid
graph LR
    TailwindCSS[Tailwind CSS] --> Layout[Layout Classes]
    TailwindCSS --> Typography[Typography Classes]
    TailwindCSS --> Colors[Color Classes]
    TailwindCSS --> Spacing[Spacing Classes]
    TailwindCSS --> Responsive[Responsive Classes]
    
    Layout --> Flexbox[Flexbox]
    Layout --> Grid[Grid]
    Layout --> Position[Position]
    
    Typography --> FontSize[Font Size]
    Typography --> FontWeight[Font Weight]
    Typography --> TextAlign[Text Align]
    
    Colors --> Primary[Primary Colors]
    Colors --> Secondary[Secondary Colors]
    Colors --> WeatherColors[Weather Colors]
    
    WeatherColors --> GoodColor[GOOD: Blue]
    WeatherColors --> NormalColor[NORMAL: Orange]
    WeatherColors --> BadColor[BAD: Red]
```

### 📱 반응형 디자인
```mermaid
graph LR
    ResponsiveDesign[Responsive Design] --> Mobile[Mobile: 320px-768px]
    ResponsiveDesign --> Tablet[Tablet: 768px-1024px]
    ResponsiveDesign --> Desktop[Desktop: 1024px+]
    
    Mobile --> SingleColumn[Single Column Layout]
    Mobile --> TouchFriendly[Touch Friendly UI]
    Mobile --> CompactNav[Compact Navigation]
    
    Tablet --> TwoColumn[Two Column Layout]
    Tablet --> SidebarNav[Sidebar Navigation]
    
    Desktop --> MultiColumn[Multi Column Layout]
    Desktop --> FullNav[Full Navigation]
    Desktop --> HoverEffects[Hover Effects]
```

## 🔧 유틸리티 함수 구조

### 🛠️ ApiService 구조
```mermaid
graph LR
    ApiService[ApiService] --> AuthAPI[Auth API]
    ApiService --> WeatherAPI[Weather API]
    ApiService --> PhotoSpotAPI[Photo Spot API]
    ApiService --> PostAPI[Post API]
    ApiService --> CommentAPI[Comment API]
    
    AuthAPI --> Login[login()]
    AuthAPI --> Signup[signup()]
    AuthAPI --> UpdateProfile[updateProfile()]
    
    WeatherAPI --> GetWeatherMap[getWeatherMap()]
    WeatherAPI --> GetWeatherGrade[getWeatherGrade()]
    WeatherAPI --> GetDistrictWeather[getDistrictWeather()]
    
    PhotoSpotAPI --> GetAllPhotoSpots[getAllPhotoSpots()]
    PhotoSpotAPI --> GetPhotoSpot[getPhotoSpot()]
    PhotoSpotAPI --> GetPhotoSpotsByRegion[getPhotoSpotsByRegion()]
    
    PostAPI --> GetPosts[getPosts()]
    PostAPI --> CreatePost[createPost()]
    PostAPI --> ToggleLike[toggleLike()]
    
    CommentAPI --> GetComments[getComments()]
    CommentAPI --> CreateComment[createComment()]
    CommentAPI --> DeleteComment[deleteComment()]
```

### 🖼️ ImageUtils 구조
```mermaid
graph LR
    ImageUtils[ImageUtils] --> GetPhotoSpotImage[getPhotoSpotImage()]
    ImageUtils --> GetDefaultImage[getDefaultImage()]
    ImageUtils --> HandleImageError[handleImageError()]
    ImageUtils --> ValidateImageSize[validateImageSize()]
    ImageUtils --> ConvertToBase64[convertToBase64()]
    
    GetPhotoSpotImage --> ImageMapping[Image Mapping]
    ImageMapping --> GangnamStation[강남역 이미지]
    ImageMapping --> Garosugil[가로수길 이미지]
    ImageMapping --> DefaultImage[기본 이미지]
    
    ValidateImageSize --> SizeCheck[Size Check]
    SizeCheck --> MaxSize[10MB 제한]
    SizeCheck --> FormatCheck[Format Check]
    FormatCheck --> PNG[PNG 지원]
    FormatCheck --> JPG[JPG 지원]
    FormatCheck --> GIF[GIF 지원]
```

## 🎯 주요 특징

### 📱 컴포넌트 특징
- **재사용 가능한 컴포넌트**: Header, WeatherMap 등
- **페이지별 컴포넌트**: 각 라우트별 전용 컴포넌트
- **조건부 렌더링**: 인증 상태에 따른 UI 변경
- **로딩 상태 처리**: 데이터 로딩 중 스켈레톤 UI

### 🔄 상태 관리
- **Context API**: 전역 상태 관리 (AuthContext)
- **Local State**: 컴포넌트별 로컬 상태
- **Form State**: 폼 입력 상태 관리
- **Loading State**: 비동기 작업 상태 관리

### 🎨 UI/UX 특징
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원
- **다크/라이트 모드**: 테마 지원
- **애니메이션**: 부드러운 전환 효과
- **접근성**: ARIA 라벨 및 키보드 네비게이션

### 🔧 개발 특징
- **TypeScript**: 타입 안전성 보장
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Vite**: 빠른 개발 환경 