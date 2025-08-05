import gangnamStationImage from '../assets/image/강남역.jpg';
import garosugilImage from '../assets/image/가로수길.jpeg';

// 포토스팟별 이미지 매핑
export const getPhotoSpotImage = (name: string, imageUrl: string): string => {
  if (name === '강남역' || imageUrl === 'gangnam-station') {
    return gangnamStationImage;
  } else if (name === '가로수길' || imageUrl === 'garosugil') {
    return garosugilImage;
  } else {
    return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop";
  }
};

// 기본 이미지 URL
export const getDefaultImage = (): string => {
  return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop";
};

// 이미지 로드 실패 시 기본 이미지로 대체하는 핸들러
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = getDefaultImage();
}; 