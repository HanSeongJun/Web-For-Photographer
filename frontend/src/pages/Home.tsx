import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api';

interface WeatherGradeData {
  [regionCode: string]: string;
}

interface RegionWeatherInfo {
  regionCode: string;
  regionName: string;
  grade: string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  pm10?: number;
  pm25?: number;
  condition?: string;
}

const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherGradeData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 지역명 매핑
  const regionNames: { [key: string]: string } = {
    SEOUL: '서울',
    BUSAN: '부산',
    DAEGU: '대구',
    INCHEON: '인천',
    GWANGJU: '광주',
    DAEJEON: '대전',
    ULSAN: '울산',
    SEJONG: '세종',
    JEJU: '제주',
    GYEONGGI: '경기도',
    GANGWON: '강원도',
    CHUNGBUK: '충청북도',
    CHUNGNAM: '충청남도',
    JEONBUK: '전라북도',
    JEONNAM: '전라남도',
    GYEONGBUK: '경상북도',
    GYEONGNAM: '경상남도'
  };

  // 등급별 색상 및 설명
  const gradeInfo = {
    GOOD: {
      color: 'bg-green-100',
      textColor: 'text-green-700',
      label: '좋음',
      description: '사진 촬영에 매우 좋은 날씨입니다!',
      icon: '☀️',
      gradient: 'from-white to-gray-50'
    },
    NORMAL: {
      color: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      label: '보통',
      description: '사진 촬영에 적당한 날씨입니다.',
      icon: '⛅',
      gradient: 'from-white to-gray-50'
    },
    BAD: {
      color: 'bg-red-100',
      textColor: 'text-red-700',
      label: '나쁨',
      description: '사진 촬영에 좋지 않은 날씨입니다.',
      icon: '🌧️',
      gradient: 'from-white to-gray-50'
    },
    FAILED: {
      color: 'bg-gray-100',
      textColor: 'text-gray-700',
      label: '데이터 없음',
      description: '날씨 데이터를 가져올 수 없습니다.',
      icon: '❓',
      gradient: 'from-white to-gray-50'
    }
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getWeatherMapData();
      setWeatherData(data);
    } catch (err) {
      console.error('날씨 데이터 로딩 실패:', err);
      setError('날씨 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const getGradeInfo = (grade: string) => {
    return gradeInfo[grade as keyof typeof gradeInfo] || gradeInfo.FAILED;
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Weather Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🌤️ 오늘의 전국 날씨 정보
            </h2>
            <p className="text-xl text-gray-600">
              사진 촬영에 최적화된 날씨 등급 시스템
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">날씨 정보를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchWeatherData} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div className="flex space-x-6 animate-scroll">
                {Object.entries(weatherData).map(([regionCode, grade]) => {
                  const info = getGradeInfo(grade);
                  
                  return (
                    <div key={regionCode} className="flex-shrink-0">
                      <div className="w-32 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-3 flex flex-col justify-center text-gray-900">
                        <div className="text-center">
                          <div className="text-2xl mb-2">
                            {info.icon}
                          </div>
                          <h3 className="text-sm font-bold mb-2 text-gray-900">
                            {regionNames[regionCode] || regionCode}
                          </h3>
                          <span className={`inline-block px-3 py-1 ${info.color} ${info.textColor} rounded-full text-xs font-medium border`}>
                            {info.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* 무한 스크롤을 위한 카드 복제 */}
                {Object.entries(weatherData).map(([regionCode, grade]) => {
                  const info = getGradeInfo(grade);
                  
                  return (
                    <div key={`${regionCode}-clone`} className="flex-shrink-0">
                      <div className="w-32 h-40 rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-3 flex flex-col justify-center text-gray-900">
                        <div className="text-center">
                          <div className="text-2xl mb-2">
                            {info.icon}
                          </div>
                          <h3 className="text-sm font-bold mb-2 text-gray-900">
                            {regionNames[regionCode] || regionCode}
                          </h3>
                          <span className={`inline-block px-3 py-1 ${info.color} ${info.textColor} rounded-full text-xs font-medium border`}>
                            {info.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/map"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg"
            >
              지금 바로 포토스팟 찾으러 가기 →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-black">
            주요 기능
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-300 rounded-lg hover:border-black transition-colors duration-300 bg-white">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">실시간 날씨 지도</h3>
              <p className="text-gray-600">전국 지역별 실시간 날씨 정보를 지도에서 한눈에 확인하세요.</p>
            </div>
            
            <div className="text-center p-8 border border-gray-300 rounded-lg hover:border-black transition-colors duration-300 bg-white">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">포토 스팟</h3>
              <p className="text-gray-600">날씨에 최적화된 사진 촬영 장소를 발견하고 공유하세요.</p>
            </div>
            
            <div className="text-center p-8 border border-gray-300 rounded-lg hover:border-black transition-colors duration-300 bg-white">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-black">날씨 예보</h3>
              <p className="text-gray-600">정확한 날씨 예보로 최적의 촬영 시기를 계획하세요.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black">
            지금 시작하세요
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            날씨와 사진의 완벽한 조화를 경험해보세요. 
            WebFroPhto와 함께 더 나은 사진을 촬영하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/map"
              className="px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              지도 보기
            </Link>
            <Link
              to="/weather"
              className="px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-colors duration-300"
            >
              날씨 확인
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-100 border-t border-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">WebFroPhto</h3>
              <p className="text-gray-600">
                날씨와 사진을 연결하는 혁신적인 플랫폼
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/map" className="hover:text-black transition-colors">날씨 지도</Link></li>
                <li><Link to="/photospots" className="hover:text-black transition-colors">포토 스팟</Link></li>
                <li><Link to="/weather" className="hover:text-black transition-colors">날씨 예보</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black mb-4">계정</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link to="/login" className="hover:text-black transition-colors">로그인</Link></li>
                <li><Link to="/signup" className="hover:text-black transition-colors">회원가입</Link></li>
                <li><Link to="/mypage" className="hover:text-black transition-colors">마이페이지</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-black mb-4">연락처</h4>
              <p className="text-gray-600">
                문의사항이 있으시면 언제든 연락주세요.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 WebFroPhto. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
          width: max-content;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Home; 