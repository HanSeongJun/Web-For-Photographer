import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import apiService from '../services/api';
import { getPhotoSpotImage, handleImageError } from '../utils/imageUtils';

interface PhotoSpot {
  id: number;
  name: string;
  region: string;
  imageUrl: string;
  likes: number;
  description: string;
}

const PhotoSpots: React.FC = () => {
  const { region } = useParams<{ region: string }>();
  const [searchParams] = useSearchParams();
  const district = searchParams.get('district');
  const [likedSpots, setLikedSpots] = useState<Set<number>>(new Set());
  const [photoSpots, setPhotoSpots] = useState<PhotoSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 지역 코드를 지역 ID로 변환하는 함수 (현재 사용하지 않음)
  // const getRegionIdFromCode = (regionCode: string): number => {
  //   const regionMap: { [key: string]: number } = {
  //     'SEOUL': 1, 'BUSAN': 2, 'DAEGU': 3, 'INCHEON': 4, 'GWANGJU': 5,
  //     'DAEJEON': 6, 'ULSAN': 7, 'SEJONG': 8, 'GYEONGGI': 9, 'GANGWON': 10,
  //     'CHUNGBUK': 11, 'CHUNGNAM': 12, 'JEONBUK': 13, 'JEONNAM': 14,
  //     'GYEONGBUK': 15, 'GYEONGNAM': 16, 'JEJU': 17
  //   };
  //   return regionMap[regionCode] || 1;
  // };

  useEffect(() => {
    const fetchPhotoSpots = async () => {
      try {
        setLoading(true);
        
        // 지역 코드를 지역 ID로 변환
        // const regionId = getRegionIdFromCode(region || 'SEOUL');
        
        // 실제 API 호출로 변경 - 지역 코드를 문자열로 전달
        const data = await apiService.getPhotoSpotsByRegion(region || 'SEOUL');
        
        // API 응답을 PhotoSpot 형식으로 변환
        const spots: PhotoSpot[] = data.map((spot: any) => {
          // 포토스팟별 이미지 매핑
          const imageUrl = getPhotoSpotImage(spot.name, spot.imageUrl);
          
          return {
            id: spot.id,
            name: spot.name,
            region: spot.regionName || '알 수 없는 지역',
            imageUrl: imageUrl,
            likes: Math.floor(Math.random() * 1000) + 100, // 임시 좋아요 수
            description: spot.description || "아름다운 명소입니다."
          };
        });
        
        setPhotoSpots(spots);
      } catch (err) {
        setError('포토스팟을 불러오는데 실패했습니다.');
        console.error('Error fetching photo spots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoSpots();
  }, [region]);

  const handleLike = (spotId: number) => {
    setLikedSpots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(spotId)) {
        newSet.delete(spotId);
      } else {
        newSet.add(spotId);
      }
      return newSet;
    });
  };

  const getRegionName = (regionCode: string): string => {
    const regionNames: { [key: string]: string } = {
      'SEOUL': '서울특별시',
      'BUSAN': '부산광역시',
      'DAEGU': '대구광역시',
      'INCHEON': '인천광역시',
      'GWANGJU': '광주광역시',
      'DAEJEON': '대전광역시',
      'ULSAN': '울산광역시',
      'SEJONG': '세종특별자치시',
      'GYEONGGI': '경기도',
      'GANGWON': '강원도',
      'CHUNGBUK': '충청북도',
      'CHUNGNAM': '충청남도',
      'JEONBUK': '전라북도',
      'JEONNAM': '전라남도',
      'GYEONGBUK': '경상북도',
      'GYEONGNAM': '경상남도',
      'JEJU': '제주특별자치도'
    };
    return regionNames[regionCode] || regionCode;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">명소를 불러오는 중...</p>
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {region ? getRegionName(region) : '전체'} 
                {district && ` · ${district}`} 명소
              </h1>
              <p className="text-gray-600">
                {photoSpots.length}개의 명소를 발견했습니다
                {district && ` (${district} 지역)`}
              </p>
            </div>
            <Link
              to="/weather"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              ← 지도로 돌아가기
            </Link>
          </div>
        </div>

        {/* 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoSpots.map((spot) => (
            <Link
              key={spot.id}
              to={`/spot/${spot.id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* 대표 사진 */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={spot.imageUrl}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(spot.id);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      likedSpots.has(spot.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={likedSpots.has(spot.id) ? "currentColor" : "none"}
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

              {/* 카드 내용 */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{spot.name}</h3>
                  <span className="text-sm text-gray-500">{spot.region}</span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{spot.description}</p>
                {/* 좋아요 수 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-sm text-gray-600">{spot.likes + (likedSpots.has(spot.id) ? 1 : 0)}</span>
                  </div>
                  <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">자세히 보기</button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 더 많은 명소 보기 버튼 */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            더 많은 명소 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoSpots; 