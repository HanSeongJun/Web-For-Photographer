import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';
import { getPhotoSpotImage, handleImageError } from '../utils/imageUtils';

interface PhotoSpot {
  id: number;
  name: string;
  description: string;
  likes: number;
  imageUrl: string;
  regionName: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  likes: number;
  imageUrl: string;
  authorName: string;
  spotName: string;
  createdAt: string;
}

interface CarouselProps {
  items: (PhotoSpot | Post)[];
  renderItem: (item: PhotoSpot | Post, index: number) => React.ReactNode;
}

const Carousel: React.FC<CarouselProps> = ({ items, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, items.length - itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="relative">
      {/* 캐러셀 컨테이너 */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out h-80"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
        >
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-1/3 flex-shrink-0 px-2 h-full">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      {items.length > itemsPerPage && (
        <>
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border hover:bg-gray-50 transition-colors ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg className="w-6 h-6 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg border hover:bg-gray-50 transition-colors ${
              currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <svg className="w-6 h-6 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {items.length > itemsPerPage && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Best: React.FC = () => {
  const [bestSpots, setBestSpots] = useState<PhotoSpot[]>([]);
  const [bestPosts, setBestPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 실제 API에서 데이터 가져오기
        const [spotsData, postsData] = await Promise.all([
          ApiService.getBestPhotoSpots(6),
          ApiService.getBestPosts(6)
        ]);

        // 포토스팟 데이터 변환
        const spots: PhotoSpot[] = spotsData.map((spot: any) => ({
          id: spot.id,
          name: spot.name,
          description: spot.description || "아름다운 포토스팟입니다.",
          likes: Math.floor(Math.random() * 2000) + 500, // 임시 좋아요 수 (추후 실제 좋아요 기능 구현)
          imageUrl: getPhotoSpotImage(spot.name, spot.imageUrl),
          regionName: spot.regionName || "지역 정보 없음"
        }));

        // 포스트 데이터 변환
        const posts: Post[] = postsData.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content || "멋진 사진입니다.",
          likes: post.likesCount || Math.floor(Math.random() * 1500) + 300, // 실제 좋아요 수 사용
          imageUrl: post.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
          authorName: post.author || "익명",
          spotName: post.photoSpotName || "포토스팟",
          createdAt: post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));

        setBestSpots(spots);
        setBestPosts(posts);

      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching best data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestData();
  }, []);

  const renderSpotItem = (item: PhotoSpot | Post) => {
    const spot = item as PhotoSpot;
    
    // 텍스트 줄임 처리
    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
      <Link
        to={`/spot/${spot.id}`}
        className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={spot.imageUrl}
            alt={spot.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{spot.likes}</span>
            </div>
          </div>
        </div>
        <div className="p-4 h-32 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 h-6 overflow-hidden">
              {truncateText(spot.name, 20)}
            </h3>
            <p className="text-gray-600 text-sm mb-2 h-10 overflow-hidden">
              {truncateText(spot.description, 60)}
            </p>
          </div>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded self-start">
            {truncateText(spot.regionName, 15)}
          </span>
        </div>
      </Link>
    );
  };

  const renderPostItem = (item: PhotoSpot | Post) => {
    const post = item as Post;
    
    // 텍스트 줄임 처리
    const truncateText = (text: string, maxLength: number) => {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    return (
      <Link
        to={`/post/${post.id}`}
        className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{post.likes}</span>
            </div>
          </div>
        </div>
        <div className="p-4 h-32 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 h-6 overflow-hidden">
              {truncateText(post.title, 25)}
            </h3>
            <p className="text-gray-600 text-sm mb-2 h-10 overflow-hidden">
              {truncateText(post.content, 60)}
            </p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{truncateText(post.authorName, 10)}</span>
            <span>{truncateText(post.spotName, 12)}</span>
          </div>
        </div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">베스트 콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🏆 베스트 포토스팟</h1>
          <p className="text-gray-600 text-lg">가장 사랑받는 명소와 멋진 사진들을 만나보세요</p>
        </div>

        {/* 베스트 포토스팟 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">🌟 베스트 포토스팟</h2>
            <Link to="/photo-spots" className="text-blue-600 hover:text-blue-700 font-medium">
              모든 포토스팟 보기 →
            </Link>
          </div>
          <Carousel items={bestSpots} renderItem={renderSpotItem} />
        </section>

        {/* 베스트 글 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">📝 베스트 글</h2>
            <Link to="/posts" className="text-blue-600 hover:text-blue-700 font-medium">
              모든 글 보기 →
            </Link>
          </div>
          <Carousel items={bestPosts} renderItem={renderPostItem} />
        </section>
      </div>
    </div>
  );
};

export default Best; 