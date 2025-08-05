import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/api';

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

const Weather: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherGradeData>({});
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionDetail, setRegionDetail] = useState<RegionWeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 지역 코드와 이름 매핑
  const regionNames: { [key: string]: string } = {
    SEOUL: '서울특별시',
    BUSAN: '부산광역시',
    DAEGU: '대구광역시',
    INCHEON: '인천광역시',
    GWANGJU: '광주광역시',
    DAEJEON: '대전광역시',
    ULSAN: '울산광역시',
    SEJONG: '세종특별자치시',
    JEJU: '제주특별자치도',
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

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWeatherMapData();
      setWeatherData(data);
    } catch (err) {
      setError('날씨 데이터를 불러오는데 실패했습니다.');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionClick = async (regionCode: string) => {
    if (selectedRegion === regionCode) {
      // 같은 지역을 다시 클릭하면 닫기
      setSelectedRegion(null);
      setRegionDetail(null);
      return;
    }

    setSelectedRegion(regionCode);
    try {
      const detail = await apiService.getRegionWeatherGrade(regionCode);
      setRegionDetail({
        regionCode,
        regionName: regionNames[regionCode] || regionCode,
        grade: detail.grade,
        temperature: detail.temperature,
        humidity: detail.humidity,
        windSpeed: detail.windSpeed,
        pm10: detail.pm10,
        pm25: detail.pm25,
        condition: detail.condition
      });
    } catch (err) {
      console.error('Error fetching region detail:', err);
      setRegionDetail({
        regionCode,
        regionName: regionNames[regionCode] || regionCode,
        grade: weatherData[regionCode] || 'FAILED'
      });
    }
  };

  const getGradeInfo = (grade: string) => {
    return gradeInfo[grade as keyof typeof gradeInfo] || gradeInfo.FAILED;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">날씨 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchWeatherData} 
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🌤️ 전국 날씨 정보
              </h1>
              <p className="text-gray-600 text-lg">
                사진 촬영에 최적화된 날씨 등급 시스템
              </p>
            </div>
            <Link
              to="/map"
              className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg"
            >
              ← 지도로 돌아가기
            </Link>
          </div>
        </div>

        {/* 가로 스크롤 카드 컨테이너 */}
        <div className="mb-8">
          <div className="relative overflow-hidden">
            <div className="flex space-x-6 animate-scroll">
              {Object.entries(weatherData).map(([regionCode, grade]) => {
                const info = getGradeInfo(grade);
                const isSelected = selectedRegion === regionCode;
                
                return (
                  <div key={regionCode} className="flex-shrink-0">
                    <button
                      onClick={() => handleRegionClick(regionCode)}
                      className={`w-32 h-40 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                        isSelected 
                          ? 'ring-4 ring-blue-400 shadow-2xl scale-105' 
                          : 'hover:-translate-y-2'
                      }`}
                    >
                      <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${info.gradient} p-3 flex flex-col justify-center text-gray-900 border border-gray-200`}>
                        {/* 지역명과 등급만 표시 */}
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
                    </button>
                  </div>
                );
              })}
              {/* 무한 스크롤을 위한 카드 복제 */}
              {Object.entries(weatherData).map(([regionCode, grade]) => {
                const info = getGradeInfo(grade);
                const isSelected = selectedRegion === regionCode;
                
                return (
                  <div key={`${regionCode}-clone`} className="flex-shrink-0">
                    <button
                      onClick={() => handleRegionClick(regionCode)}
                      className={`w-32 h-40 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                        isSelected 
                          ? 'ring-4 ring-blue-400 shadow-2xl scale-105' 
                          : 'hover:-translate-y-2'
                      }`}
                    >
                      <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${info.gradient} p-3 flex flex-col justify-center text-gray-900 border border-gray-200`}>
                        {/* 지역명과 등급만 표시 */}
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
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 선택된 지역 상세 정보 */}
        {selectedRegion && regionDetail && (
          <div className="mb-8 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">
                  {getGradeInfo(regionDetail.grade).icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {regionDetail.regionName}
                </h2>
                <span className={`inline-block px-6 py-3 rounded-full text-lg font-bold ${
                  getGradeInfo(regionDetail.grade).color
                } ${getGradeInfo(regionDetail.grade).textColor}`}>
                  {getGradeInfo(regionDetail.grade).label}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {regionDetail.temperature && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-lg">🌡️ 기온</span>
                      <span className="font-bold text-2xl text-blue-600">{regionDetail.temperature}°C</span>
                    </div>
                  </div>
                )}
                {regionDetail.humidity && (
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-lg">💧 습도</span>
                      <span className="font-bold text-2xl text-green-600">{regionDetail.humidity}%</span>
                    </div>
                  </div>
                )}
                {regionDetail.windSpeed && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-lg">💨 풍속</span>
                      <span className="font-bold text-2xl text-purple-600">{regionDetail.windSpeed}m/s</span>
                    </div>
                  </div>
                )}
                {regionDetail.pm10 && (
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-lg">🌫️ PM10</span>
                      <span className="font-bold text-2xl text-orange-600">{regionDetail.pm10}㎍/㎥</span>
                    </div>
                  </div>
                )}
                {regionDetail.pm25 && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-lg">🌫️ PM2.5</span>
                      <span className="font-bold text-2xl text-red-600">{regionDetail.pm25}㎍/㎥</span>
                    </div>
                  </div>
                )}
                {regionDetail.condition && (
                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-lg">☁️ 날씨</span>
                      <span className="font-bold text-2xl text-indigo-600">{regionDetail.condition}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">📸 사진 촬영 권장사항</h3>
                <p className="text-gray-700 leading-relaxed">
                  {getGradeInfo(regionDetail.grade).description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 등급 설명 */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📋 등급 설명</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(gradeInfo).map(([grade, info]) => (
                <div key={grade} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{info.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${info.color} ${info.textColor}`}>
                      {info.label}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 업데이트 정보 */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
            <p className="text-gray-600 mb-4">날씨 정보는 10분마다 자동으로 업데이트됩니다.</p>
            <button 
              onClick={fetchWeatherData}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg"
            >
              🔄 지금 업데이트
            </button>
          </div>
        </div>
      </div>

      {/* 커스텀 CSS */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
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

export default Weather; 