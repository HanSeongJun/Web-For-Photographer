import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const WritePost: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/write/${spotId}` } });
    }
  }, [isAuthenticated, navigate, spotId]);

  // 로그인하지 않은 경우 로딩 화면 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">로그인 확인 중...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 10MB 크기 제한 확인
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError('이미지 크기가 10MB를 초과합니다. 더 작은 이미지를 선택해주세요.');
        return;
      }
      
      setSelectedImage(file);
      setError(null); // 이전 오류 메시지 제거
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!spotId) {
      setError('포토스팟 정보를 찾을 수 없습니다.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 이미지 URL 처리 (10MB 이하 이미지 허용)
      let imageUrl = '';
      if (selectedImage) {
        // 10MB = 10 * 1024 * 1024 = 10,485,760 bytes
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (selectedImage.size <= maxSize) {
          // Base64 데이터가 너무 길면 기본 이미지 사용
          if (imagePreview && imagePreview.length < 500000) { // 약 500KB로 제한
            imageUrl = imagePreview;
          } else {
            imageUrl = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop";
          }
        } else {
          setError('이미지 크기가 10MB를 초과합니다. 더 작은 이미지를 선택해주세요.');
          return;
        }
      }

      // 태그 파싱
      const tagList = tags.split(' ')
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#'))
        .filter(tag => tag.length > 1);

      const postData = {
        title: title.trim(),
        content: content.trim(),
        author: user?.nickname || "사용자",
        imageUrl: imageUrl,
        photoSpotId: parseInt(spotId),
        tags: tagList
      };

      console.log('Creating post with data:', postData);
      console.log('User:', user);
      console.log('Auth token:', localStorage.getItem('token'));
      console.log('Image URL length:', postData.imageUrl ? postData.imageUrl.length : 0);
      console.log('Image URL preview:', postData.imageUrl ? postData.imageUrl.substring(0, 100) + '...' : 'No image');

      await apiService.createPost(postData);
      
      // 작성 완료 후 상세 페이지로 이동
      navigate(`/spot/${spotId}`);
    } catch (err) {
      setError('글 작성에 실패했습니다. 다시 시도해주세요.');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/spot/${spotId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                글쓰기
              </h1>
              <p className="text-gray-600">
                아름다운 순간을 공유해보세요
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 글 작성 폼 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
          {/* 사진 업로드 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사진 업로드
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="max-w-full h-64 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-blue-500 hover:text-blue-600 font-medium">
                        사진 선택하기
                      </span>
                      <span className="text-gray-500"> 또는 드래그 앤 드롭</span>
                    </label>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF 최대 10MB까지 업로드 가능
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 제목 입력 */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          {/* 내용 입력 */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이 순간에 대한 이야기를 들려주세요..."
              required
            />
          </div>

          {/* 태그 입력 */}
          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              태그 (선택사항)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="태그를 입력하세요 (예: #야경 #서울 #남산타워)"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg transition-colors ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {loading ? '작성 중...' : '글 작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WritePost; 