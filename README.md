# 📸 WebForPhoto - 포토스팟 공유 플랫폼

사진 촬영은 단순히 장소뿐 아니라, 시간대·날씨 등 다양한 변수에 영향을 받습니다. 그러나 이 모든 정보를 여러 사이트에서 따로 확인해야 하는 번거로움이 있어, 촬영 장소 정보와 실시간 날씨를 한 눈에 확인할 수 있는 통합 서비스가 필요하다고 느꼈습니다. 이를 해결하기 위해 사진가들이 포토스팟을 효율적으로 탐색하고, 최적의 촬영 타이밍까지 예측할 수 있도록 돕는 웹사이트를 직접 기획하고 개발하였습니다.


---

## 🚀 기술 스택

| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)|
|------|------|
| **Backend** | ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white) ![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white) ![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) ![JPA](https://img.shields.io/badge/JPA-59666C?style=for-the-badge&logo=hibernate&logoColor=white) ![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)|
| **Server** | ![Tomcat](https://img.shields.io/badge/Tomcat-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=black) ![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white) |
| **DB** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![AWS RDS](https://img.shields.io/badge/AWS%20RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)| 
| **Tools** | ![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ%20IDEA-000000?style=for-the-badge&logo=intellijidea&logoColor=white) ![DataGrip](https://img.shields.io/badge/DataGrip-000000?style=for-the-badge&logo=datagrip&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white) |

---

## 📁 프로젝트 구조

```
Renew_WebForPhoto-main/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── services/       # API 서비스
│   │   ├── types/          # TypeScript 타입 정의
│   │   ├── utils/          # 유틸리티 함수
│   │   └── context/        # React Context
│   ├── public/             # 정적 파일
│   └── package.json
├── src/main/java/backend/WebFroPhto/
│   ├── config/             # 설정 클래스
│   ├── controller/         # REST API 컨트롤러
│   ├── service/           # 비즈니스 로직
│   ├── repository/        # 데이터 접근 계층
│   ├── entity/           # JPA 엔티티
│   └── dto/              # 데이터 전송 객체
├── src/main/resources/    # 설정 파일
├── docs/                 # 프로젝트 문서
├── docker-compose.local.yml
└── build.gradle
```

---


## 📊 데이터베이스 스키마 (ERD)

![ERD](https://ifh.cc/g/J5h9xt.jpg)

## 🌟 주요 기능

### 📍 포토스팟 관리
- **포토스팟 검색**: 지역별 포토스팟 조회
- **포토스팟 상세**: 위치, 설명, 이미지 확인
- **포토스팟 등록**: 새로운 포토스팟 추가

### 📝 게시글 시스템
- **글 작성**: 포토스팟별 게시글 작성
- **이미지 업로드**: 최대 10MB 이미지 지원
- **태그 시스템**: 게시글 태그 기능
- **좋아요 기능**: 게시글 좋아요/취소

### 🌤️ 날씨 정보
- **실시간 날씨**: 기상청 API 연동
- **미세먼지 정보**: 환경공단 API 연동
- **날씨 점수**: 포토스팟별 날씨 등급
- **지역별 날씨**: 전국 17개 시도 날씨

### 👤 사용자 관리
- **회원가입/로그인**: JWT 기반 인증
- **프로필 관리**: 사용자 정보 관리
- **마이페이지**: 개인 활동 내역

### 🗺️ 지도 기능
- **네이버 지도**: 포토스팟 위치 표시
- **지역 선택**: 시도/시군구 선택

--- 
## 프로젝트 사용자 화면 및 시연 영상

### 시연 영상
https://www.youtube.com/watch?v=0hXhYrfzDds

### 사용자 화면
| 메인 화면 | 메인 화면 2 | 날씨 지도 |
|--------|--------|--------|
|![main](https://ifh.cc/g/RlRLTM.jpg) | ![main2](https://ifh.cc/g/gKHjzA.png)| ![map](https://ifh.cc/g/cdk7JG.png)

| 지역별 명소 | 명소별 글 목록 | 글 내용 |
|--------|--------|--------|
|![SPOT](https://ifh.cc/g/ALAqxH.jpg)|![board](https://ifh.cc/g/QkpXqK.jpg)|![글](https://ifh.cc/g/6bzRtl.jpg)

| 글쓰기 | 로그인 | 회원가입 |
|--------|--------|--------|
|![](https://ifh.cc/g/KK6tGn.png) |![](https://ifh.cc/g/H3D5nj.png) |![](https://ifh.cc/g/fdQ6mN.png) |

---

## 📡 API 명세서

### 🔐 인증 API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/login` | 로그인 | `{email, password}` | `{token, user}` |
| POST | `/api/auth/signup` | 회원가입 | `{email, password, nickname}` | `{message}` |
| PUT | `/api/auth/profile-image` | 프로필 이미지 업데이트 | `{imageUrl}` | `{user}` |

### 🌤️ 날씨 API

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| GET | `/api/weather/map` | 전국 날씨 지도 데이터 | - | `Map<String, WeatherDto>` |
| GET | `/api/weather/grade/{regionCode}` | 지역별 상세 날씨 정보 | `regionCode` | `WeatherDto` |
| GET | `/api/weather/district/{districtCode}` | 시군구별 날씨 정보 | `districtCode` | `WeatherDto` |

### 📍 포토스팟 API

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| GET | `/api/photospots` | 전체 포토스팟 목록 | - | `List<PhotoSpotDto>` |
| GET | `/api/photospots/{spotId}` | 특정 포토스팟 상세 | `spotId` | `PhotoSpotDto` |
| GET | `/api/photospots/region/{regionId}` | 지역별 포토스팟 | `regionId` | `List<PhotoSpotDto>` |
| GET | `/api/photospots/region/code/{regionCode}` | 지역코드별 포토스팟 | `regionCode` | `List<PhotoSpotDto>` |
| GET | `/api/photospots/best` | 베스트 포토스팟 | `limit` | `List<PhotoSpotDto>` |
| POST | `/api/photospots` | 포토스팟 생성 | `PhotoSpotDto` | `PhotoSpotDto` |

### 📝 게시글 API

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| GET | `/api/posts` | 전체 게시글 목록 | - | `List<PostDto>` |
| GET | `/api/posts/{postId}` | 특정 게시글 상세 | `postId` | `PostDto` |
| GET | `/api/posts/spot/{spotId}/latest` | 포토스팟별 최신 게시글 | `spotId` | `List<PostDto>` |
| GET | `/api/posts/spot/{spotId}/best` | 포토스팟별 베스트 게시글 | `spotId` | `List<PostDto>` |
| POST | `/api/posts` | 게시글 작성 | `CreatePostRequest` | `PostDto` |
| POST | `/api/posts/{postId}/like` | 게시글 좋아요 | `postId, userId` | `PostDto` |
| GET | `/api/posts/best` | 베스트 게시글 | `limit` | `List<PostDto>` |

### 💬 댓글 API

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| GET | `/api/comments/post/{postId}` | 게시글별 댓글 목록 | `postId` | `List<CommentDto>` |
| POST | `/api/comments` | 댓글 작성 | `CreateCommentRequest` | `CommentDto` |
| DELETE | `/api/comments/{commentId}` | 댓글 삭제 | `commentId, userId` | `{message}` |
| POST | `/api/comments/{commentId}/like` | 댓글 좋아요 | `commentId` | `CommentDto` |

### 🗺️ 지역 API

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| GET | `/api/regions` | 전체 지역 목록 | - | `List<RegionDto>` |
| GET | `/api/regions/{id}` | 특정 지역 정보 | `id` | `RegionDto` |
| GET | `/api/regions/code/{code}` | 지역코드별 정보 | `code` | `RegionDto` |

## 🛠️ 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd Renew_WebForPhoto-main
```

### 2. 데이터베이스 설정
```sql
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE WFP CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 백엔드 실행
```bash
# 프로젝트 루트 디렉토리에서
./gradlew bootRun
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

### 4. 프론트엔드 실행
```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.


## 🔧 환경 설정

### 데이터베이스 설정
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/WFP
spring.datasource.username=root
spring.datasource.password=1234
```

### API 키 설정
```properties
# 기상청 API
weather.api.key=your-weather-api-key

# 환경공단 API
air.api.key=your-air-quality-api-key
```
