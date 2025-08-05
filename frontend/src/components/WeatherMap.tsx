import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import koreaRegionsPath from '../assets/korea_regions_path.json';

// WeatherGradeData 타입 정의
interface WeatherGradeData {
  grade: string;
  score: number;
  airQuality: {
    pm10: number;
    pm25: number;
    pm10Grade: string;
    pm25Grade: string;
  };
  weather: {
    cloudCover: number;
    humidity: number;
    temperature: number;
    windSpeed: number;
  };
  dataTime: string;
}

interface WeatherMapData {
  [key: string]: {
    grade: string;
    temperature?: string;
    humidity?: string;
  };
}

interface RegionPathData {
  id: string;
  d: string;
}

interface KoreaRegionsPath {
  [key: string]: RegionPathData;
}

// 지역별 API 코드 매핑
const regionApiCodes = {
  '서울특별시': 'SEOUL',
  '부산광역시': 'BUSAN', 
  '대구광역시': 'DAEGU',
  '인천광역시': 'INCHEON',
  '광주광역시': 'GWANGJU',
  '대전광역시': 'DAEJEON',
  '울산광역시': 'ULSAN',
  '세종특별자치시': 'SEJONG',
  '경기도': 'GYEONGGI',
  '강원특별자치도': 'GANGWON',
  '충청북도': 'CHUNGBUK',
  '충청남도': 'CHUNGNAM',
  '전라북도': 'JEONBUK',
  '전라남도': 'JEONNAM',
  '경상북도': 'GYEONGBUK',
  '경상남도': 'GYEONGNAM',
  '제주특별자치도': 'JEJU'
};

// 지역별 구/군 데이터
const regionDistricts = {
  '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '부산광역시': ['강서구', '금정구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구', '기장군'],
  '대구광역시': ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
  '인천광역시': ['계양구', '남구', '남동구', '동구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군'],
  '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
  '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
  '울산광역시': ['남구', '동구', '북구', '중구', '울주군'],
  '세종특별자치시': ['세종특별자치시'],
  '경기도': ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시', '동두천시', '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '용인시', '파주시', '이천시', '안성시', '김포시', '화성시', '광주시', '여주시', '양평군', '고양군', '연천군', '포천군', '가평군'],
  '강원특별자치도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '홍천군', '횡성군', '영월군', '평창군', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군'],
  '충청북도': ['청주시', '충주시', '제천시', '청원군', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
  '충청남도': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '연기군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
  '전라북도': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
  '전라남도': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
  '경상북도': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
  '경상남도': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
  '제주특별자치도': ['제주시', '서귀포시']
};

// JSON 파일에서 지역별 SVG Path 데이터 사용
const regionPaths = koreaRegionsPath as KoreaRegionsPath;

const WeatherMap: React.FC = () => {
  const [weatherMapData, setWeatherMapData] = useState<WeatherMapData>({});
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [districts, setDistricts] = useState<string[]>([]);
  const [districtWeather, setDistrictWeather] = useState<WeatherGradeData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeatherMapData();
    
    // 지역 데이터 확인
    console.log('강원도 경로 데이터:', regionPaths['강원특별자치도']);
    console.log('제주도 데이터:', regionPaths['제주특별자치도']);
    console.log('모든 지역:', Object.keys(regionPaths));
  }, []);

  const fetchWeatherMapData = async () => {
    try {
      const response = await ApiService.getWeatherMapData();
      console.log('API 응답:', response);
      
      // API 응답을 WeatherMapData 타입으로 변환
      const weatherData: WeatherMapData = {};
      
      // API 코드를 한글 지역명으로 매핑
      const apiCodeToKoreanName: { [key: string]: string } = {
        'SEOUL': '서울특별시',
        'BUSAN': '부산광역시',
        'DAEGU': '대구광역시',
        'INCHEON': '인천광역시',
        'GWANGJU': '광주광역시',
        'DAEJEON': '대전광역시',
        'ULSAN': '울산광역시',
        'SEJONG': '세종특별자치시',
        'GYEONGGI': '경기도',
        'GANGWON': '강원특별자치도',
        'CHUNGBUK': '충청북도',
        'CHUNGNAM': '충청남도',
        'JEONBUK': '전라북도',
        'JEONNAM': '전라남도',
        'GYEONGBUK': '경상북도',
        'GYEONGNAM': '경상남도',
        'JEJU': '제주특별자치도'
      };

      // API 응답을 변환
      Object.keys(response).forEach(apiCode => {
        const koreanName = apiCodeToKoreanName[apiCode];
        if (koreanName) {
          weatherData[koreanName] = {
            grade: response[apiCode],
            temperature: undefined,
            humidity: undefined
          };
        }
      });

      console.log('변환된 날씨 데이터:', weatherData);
      setWeatherMapData(weatherData);
    } catch (error) {
      console.error('날씨 데이터 조회 실패:', error);
    }
  };

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    setDistricts(regionDistricts[regionName as keyof typeof regionDistricts] || []);
  };

  const handleDistrictClick = async (districtName: string) => {
    const apiCode = regionApiCodes[selectedRegion as keyof typeof regionApiCodes];
    setSelectedDistrict(districtName);
    setDistrictWeather(null);
    if (apiCode) {
      try {
        const weatherDetail = await ApiService.getRegionWeatherGrade(apiCode);
        setDistrictWeather(weatherDetail);
      } catch (error) {
        setDistrictWeather(null);
      }
      navigate(`/photo-spots/${apiCode}?district=${encodeURIComponent(districtName)}`);
    }
  };

  const renderRegion = (regionName: string) => {
    const pathData = regionPaths[regionName]?.d;
    if (!pathData) {
      console.log(`경로 데이터 없음: ${regionName}`);
      return null;
    }

    const weatherData = weatherMapData[regionName];
    const grade = weatherData?.grade || 'NORMAL';
    
    // 강원도 디버깅
    if (regionName === '강원특별자치도') {
      console.log('강원도 데이터:', weatherData);
      console.log('강원도 등급:', grade);
    }
    
    let fillColor = '#e5e7eb'; // 기본 색상
    
    switch (grade) {
      case 'GOOD':
        fillColor = '#0ea5e9'; // 하늘색
        break;
      case 'NORMAL':
        fillColor = '#f59e0b'; // 주황색
        break;
      case 'BAD':
        fillColor = '#ef4444'; // 빨간색
        break;
      case 'FAILED':
        fillColor = '#e5e7eb'; // 회색
        break;
      default:
        fillColor = '#e5e7eb'; // 회색
    }

    // 선택된 지역이 있으면 해당 지역만 강조 표시
    const isSelected = selectedRegion === regionName;
    const opacity = selectedRegion && !isSelected ? 0.3 : 1;
    const strokeWidth = isSelected ? 1.5 : 1;
    const strokeColor = isSelected ? '#000000' : '#ffffff';

    return (
      <path
        key={regionName}
        d={pathData}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        opacity={opacity}
        className="cursor-pointer hover:opacity-80 transition-all duration-300"
        onClick={() => handleRegionClick(regionName)}
      />
    );
  };

  // 선택된 지역의 viewBox 계산
  const getSelectedRegionViewBox = () => {
    // 항상 전체 지도 표시
    return "0 0 800 900";
  };


  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* 지도 영역 */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">한국 날씨 지도</h2>
          
          {/* 범례 */}
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-sky-500 rounded mr-2"></div>
              <span className="text-sm">좋음</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
              <span className="text-sm">중간</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">나쁨</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <span className="text-sm">데이터 안들어옴</span>
            </div>
          </div>

          {/* SVG 지도 */}
          <div className="relative w-full flex-1 min-h-0">
            <svg
              viewBox={getSelectedRegionViewBox()}
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {Object.keys(regionPaths).map(renderRegion)}
            </svg>
          </div>
        </div>
      </div>

      {/* 선택된 지역 정보 */}
      <div className="w-full lg:w-80 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">지역 선택</h3>
          
          {selectedRegion && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">선택된 지역: {selectedRegion}</h4>
              
              {weatherMapData[selectedRegion] && (
                <div className="bg-gray-50 p-3 rounded mb-4">
                  <p className="text-sm text-gray-600">
                    날씨 등급: {weatherMapData[selectedRegion].grade}
                  </p>
                  {weatherMapData[selectedRegion].temperature && (
                    <p className="text-sm text-gray-600">
                      온도: {weatherMapData[selectedRegion].temperature}
                    </p>
                  )}
                  {weatherMapData[selectedRegion].humidity && (
                    <p className="text-sm text-gray-600">
                      습도: {weatherMapData[selectedRegion].humidity}
                    </p>
                  )}
                </div>
              )}

              {/* 구/군 상세 날씨 정보 */}
              {selectedDistrict && districtWeather && districtWeather.airQuality && (
                <div className="bg-blue-50 p-3 rounded mb-4">
                  <p className="text-sm font-semibold text-blue-700 mb-1">{selectedDistrict} 상세 날씨</p>
                  <p className="text-sm text-gray-700">등급: {districtWeather.grade} (점수: {districtWeather.score})</p>
                  <p className="text-sm text-gray-700">미세먼지(PM10): {districtWeather.airQuality?.pm10 || 'N/A'} ({districtWeather.airQuality?.pm10Grade || 'N/A'})</p>
                  <p className="text-sm text-gray-700">초미세먼지(PM2.5): {districtWeather.airQuality?.pm25 || 'N/A'} ({districtWeather.airQuality?.pm25Grade || 'N/A'})</p>
                  <p className="text-sm text-gray-700">구름량: {districtWeather.weather?.cloudCover || 'N/A'}%</p>
                  <p className="text-sm text-gray-700">습도: {districtWeather.weather?.humidity || 'N/A'}%</p>
                  <p className="text-xs text-gray-400 mt-1">측정시각: {districtWeather.dataTime || 'N/A'}</p>
                </div>
              )}

              <div className="mb-4">
                <h5 className="font-medium text-gray-700 mb-2">구/군 선택:</h5>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {districts.map((district) => (
                    <button
                      key={district}
                      onClick={() => handleDistrictClick(district)}
                      className={`text-sm p-2 rounded transition-colors ${selectedDistrict === district ? 'bg-blue-200 font-bold' : 'bg-blue-50 hover:bg-blue-100'}`}
                    >
                      {district}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!selectedRegion && (
            <p className="text-gray-500 text-sm">
              지도에서 지역을 클릭하여 구/군을 선택하세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherMap; 