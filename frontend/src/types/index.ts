// 사용자 관련 타입
export interface User {
  id: number;
  email: string;
  nickname: string;
  role: "USER" | "ADMIN";
  profileImageUrl?: string;
}

// 인증 관련 타입
export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  email: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
}

// 지역 관련 타입
export interface Region {
  id: number;
  name: string;
  code: string;
  type: string;
  parentId?: number;
  latitude: number;
  longitude: number;
  photoSpotCount?: number;
  weatherGrade?: string;
}

// 포토 스팟 관련 타입
export interface PhotoSpot {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  regionId: number;
  weatherScore: number;
  createdAt: string;
  updatedAt: string;
  regionName?: string;
}

// 날씨 관련 타입
export interface WeatherData {
  id: number;
  regionId: number;
  temperature: number;
  humidity?: number;
  windSpeed?: number;
  pm10?: number;
  pm25?: number;
  weatherCondition?: string;
  weatherGrade?: string;
  measuredAt?: string;
  createdAt?: string;
}
// 지도 관련 타입
export interface WeatherMapData {
  [regionCode: string]: string; // 지역 코드 -> 날씨 등급
}

export interface NaverMapRegion {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  paths: [number, number][]; // 실제 경계 좌표
}

