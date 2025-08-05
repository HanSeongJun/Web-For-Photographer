import React from 'react';
import WeatherMap from '../components/WeatherMap';

const Map: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">날씨 지도</h1>
          <p className="text-gray-600 text-lg">
            전국 지역별 실시간 날씨 정보를 확인하세요
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">날씨 등급</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">좋음 (Green)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">보통 (Orange)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">나쁨 (Red)</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">사용법</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 지도에서 지역을 클릭하세요</li>
              <li>• 날씨 정보를 확인할 수 있습니다</li>
              <li>• 색상으로 촬영 적합도를 판단하세요</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">정보</h3>
            <p className="text-gray-700">
              실시간 날씨 데이터를 기반으로 한 지역별 촬영 적합도 분석 서비스입니다.
            </p>
          </div>
        </div>

        <br></br>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <WeatherMap />
        </div>

      </div>
    </div>
  );
};

export default Map; 