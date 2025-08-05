import type { AuthResponse, LoginRequest, SignUpRequest, Region } from "../types";

const API_BASE_URL = 'http://localhost:8080/api';

// 토큰을 가져오는 헬퍼 함수
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// API 응답 처리를 위한 헬퍼 함수
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'API 요청 실패';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

class ApiService {
  // 인증 관련 API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return handleApiResponse(response);
  }

  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return handleApiResponse(response);
  }

  // 날씨 관련 API
  async getWeatherMapData(): Promise<Record<string, string>> {
    const response = await fetch(`${API_BASE_URL}/weather/map`);
    return handleApiResponse(response);
  }

  // 새로운 메서드: 상세 날씨 정보 조회
  async getRegionWeatherGrade(regionCode: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/weather/grade/${regionCode}`);
    return handleApiResponse(response);
  }

  // 지역 관련 API
  async getRegions(): Promise<Region[]> {
    const response = await fetch(`${API_BASE_URL}/regions`);
    return handleApiResponse(response);
  }

  async getRegionById(id: number): Promise<Region> {
    const response = await fetch(`${API_BASE_URL}/regions/${id}`);
    return handleApiResponse(response);
  }

  // 포토스팟 관련 API
  async getBestPhotoSpots(limit: number = 6): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/photospots/best?limit=${limit}`);
    return handleApiResponse(response);
  }

  async getPhotoSpotsByRegion(regionCode: string): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/photospots/region/code/${regionCode}`);
    return handleApiResponse(response);
  }

  async getPhotoSpot(spotId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/photospots/${spotId}`);
    return handleApiResponse(response);
  }

  // 포스트 관련 API
  async getBestPosts(limit: number = 6): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/posts/best?limit=${limit}`);
    return handleApiResponse(response);
  }

  async getLatestPosts(spotId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/posts/spot/${spotId}/latest`);
    return handleApiResponse(response);
  }

  async getBestPostsBySpot(spotId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/posts/spot/${spotId}/best`);
    return handleApiResponse(response);
  }

  async getPost(postId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    return handleApiResponse(response);
  }

  async createPost(postData: any): Promise<any> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 인증 토큰이 있으면 추가 (선택사항)
    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }
    
    console.log('API Request Headers:', headers);
    console.log('API Request Body:', postData);
    
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers,
      body: JSON.stringify(postData),
    });
    
    console.log('API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    console.log('API Success Response:', result);
    return result;
  }

  async likePost(postId: number, userId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like?userId=${userId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  }

  async getLikeStatus(postId: number, userId: number): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like-status?userId=${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  }

  // 댓글 관련 API
  async getCommentsByPostId(postId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
    return handleApiResponse(response);
  }

  async createComment(commentData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(commentData),
    });
    return handleApiResponse(response);
  }

  async likeComment(commentId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/like`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  }

  async deleteComment(commentId: number, userId: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}?userId=${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleApiResponse(response);
  }

  // 프로필 이미지 업데이트
  async updateProfileImage(userId: number, imageUrl: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/profile-image`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ userId, imageUrl }),
    });
    return handleApiResponse(response);
  }
}

export default new ApiService();
