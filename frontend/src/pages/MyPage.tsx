import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MyPage: React.FC = () => {
  const { user, updateProfileImage } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleImageUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUpdating(true);
      
      // 파일을 Base64로 변환
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageUrl = e.target?.result as string;
        await updateProfileImage(user?.id || 1, imageUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('프로필 이미지 업데이트 실패:', error);
      alert('프로필 이미지 업데이트에 실패했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>
      
      <div className="flex gap-8">
        {/* Left Sidebar - User Info */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="relative inline-block">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="프로필" 
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl text-white font-bold">
                      {user?.nickname?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpdate}
                    className="hidden"
                    disabled={isUpdating}
                  />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </label>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {user?.nickname || '사용자'}
              </h2>
              <p className="text-gray-600 text-sm">
                {user?.email || 'user@example.com'}
              </p>
              {isUpdating && (
                <p className="text-blue-600 text-sm mt-2">이미지 업데이트 중...</p>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">내 정보</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">닉네임:</span>
                    <span className="font-medium">{user?.nickname || '미설정'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이메일:</span>
                    <span className="font-medium">{user?.email || '미설정'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">가입일:</span>
                    <span className="font-medium">2024년 1월</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-3">활동 통계</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-xs text-gray-600">방문한 포토스팟</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">업로드한 사진</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-2xl font-semibold mb-2">마이페이지 기능 준비 중</h2>
              <p className="text-gray-600 mb-6">
                개인 설정 및 즐겨찾기<br />
                촬영 히스토리 관리
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h3 className="font-medium mb-2">즐겨찾기</h3>
                  <p className="text-sm text-gray-600">좋아하는 포토스팟을 저장하세요</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <h3 className="font-medium mb-2">내 사진</h3>
                  <p className="text-sm text-gray-600">업로드한 사진들을 관리하세요</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">⚙️</div>
                  <h3 className="font-medium mb-2">설정</h3>
                  <p className="text-sm text-gray-600">계정 정보를 수정하세요</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-medium mb-2">통계</h3>
                  <p className="text-sm text-gray-600">활동 내역을 확인하세요</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage; 