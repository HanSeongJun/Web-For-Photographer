import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

interface Photo {
  id: number;
  url: string;
  title: string;
  author: string;
  likes: number;
  createdAt: string;
  description: string;
}

const PhotoSpotDetail: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'latest' | 'best'>('latest');
  const [latestPhotos, setLatestPhotos] = useState<Photo[]>([]);
  const [bestPhotos, setBestPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spotInfo, setSpotInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!spotId) return;
      
      try {
        setLoading(true);
        
        // 포토스팟 정보 가져오기
        const spotData = await apiService.getPhotoSpot(parseInt(spotId));
        
        // 포토스팟별 이미지 매핑
        let imageUrl = spotData.imageUrl;
        if (spotData.name === '강남역' || spotData.imageUrl === 'gangnam-station') {
          imageUrl = '/images/강남역.jpg';
        } else if (spotData.name === '가로수길' || spotData.imageUrl === 'garosugil') {
          imageUrl = '/images/가로수길.jpeg';
        } else {
          imageUrl = imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop";
        }
        
        setSpotInfo({
          id: spotId,
          name: spotData.name || "알 수 없는 명소",
          region: spotData.regionName || "서울특별시",
          description: spotData.description || "아름다운 명소입니다.",
          imageUrl: imageUrl
        });

        // 최신 포스트 가져오기
        const latestData = await apiService.getLatestPosts(parseInt(spotId));
        console.log('Latest posts data:', latestData);
        const latestPhotosData: Photo[] = latestData.map((post: any) => ({
          id: post.id,
          url: post.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          title: post.title,
          author: post.author,
          likes: post.likesCount || 0,
          createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "2024-01-15",
          description: post.content || "아름다운 사진입니다."
        }));
        setLatestPhotos(latestPhotosData);
        console.log('Latest photos state:', latestPhotosData);

        // 베스트 포스트 가져오기
        console.log('=== 베스트 포스트 API 호출 시작 ===');
        console.log('Spot ID:', spotId);
        const bestData = await apiService.getBestPostsBySpot(parseInt(spotId));
        console.log('=== 베스트 포스트 API 응답 ===');
        console.log('Best posts data:', bestData);
        console.log('Best posts data length:', bestData ? bestData.length : 'undefined');
        console.log('Best posts data type:', typeof bestData);
        
        if (!bestData || !Array.isArray(bestData)) {
          console.error('베스트 포스트 데이터가 배열이 아닙니다:', bestData);
          setBestPhotos([]);
        } else {
          const bestPhotosData: Photo[] = bestData.map((post: any) => ({
            id: post.id,
            url: post.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
            title: post.title,
            author: post.author,
            likes: post.likesCount || 0,
            createdAt: post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "2024-01-15",
            description: post.content || "아름다운 사진입니다."
          }));
          setBestPhotos(bestPhotosData);
          console.log('=== 베스트 포스트 변환 완료 ===');
          console.log('Best photos state:', bestPhotosData);
          console.log('Best photos count:', bestPhotosData.length);
        }

      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [spotId]);

  const handleLike = async (photoId: number) => {
    if (!isAuthenticated) {
      alert('좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }

    try {
      // 임시로 userId를 1로 설정 (실제로는 로그인된 사용자 ID를 사용해야 함)
      const userId = 1;
      
      // 좋아요 API 호출
      await apiService.likePost(photoId, userId);
      
      // 로컬 상태 업데이트
      setLatestPhotos(prev => 
        prev.map(photo => 
          photo.id === photoId 
            ? { ...photo, likes: photo.likes + 1 }
            : photo
        )
      );
      
      setBestPhotos(prev => 
        prev.map(photo => 
          photo.id === photoId 
            ? { ...photo, likes: photo.likes + 1 }
            : photo
        )
      );
    } catch (err) {
      console.error('Error liking post:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const currentPhotos = activeTab === 'latest' ? latestPhotos : bestPhotos;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {spotInfo?.name || "알 수 없는 명소"}
              </h1>
              <p className="text-gray-600 mb-4">
                {spotInfo?.description || "아름다운 명소입니다."}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📍 {spotInfo?.region || "알 수 없는 지역"}</span>
                <span>📸 {latestPhotos.length}개의 사진</span>
              </div>
            </div>
            <div className="ml-8">
              <Link
                to="/map"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                ← 지도로 돌아가기
              </Link>
            </div>
          </div>

        </div>

        {/* 탭 버튼 */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'latest'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            최신 사진
          </button>
          <button
            onClick={() => setActiveTab('best')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'best'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            베스트 사진
          </button>
          {isAuthenticated ? (
            <Link
              to={`/write/${spotId}`}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              ✏️ 글쓰기
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              ✏️ 글쓰기 (로그인 필요)
            </Link>
          )}
        </div>

        {/* 사진 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPhotos.map((photo) => (
            <Link
              key={photo.id}
              to={`/post/${photo.id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* 사진 */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      isAuthenticated
                        ? 'bg-white text-red-500 hover:bg-red-50'
                        : 'bg-white text-gray-400 cursor-not-allowed'
                    }`}
                    title={isAuthenticated ? "좋아요" : "로그인이 필요합니다"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 사진 정보 */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {photo.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {photo.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span>👤 {photo.author}</span>
                    <span>📅 {photo.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>{photo.likes}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            더 많은 사진 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoSpotDetail; 