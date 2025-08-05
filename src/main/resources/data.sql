-- 지역 데이터 추가 (서울시만 유지)
INSERT INTO regions (id, name, code, type, latitude, longitude) VALUES 
(1, '서울특별시', 'SEOUL', 'CITY', 37.5665, 126.9780);

-- 서울 강남구 포토스팟 데이터 추가
INSERT INTO photo_spots (name, description, latitude, longitude, region_id, weather_score, image_url, created_at, updated_at) VALUES 
('강남역', '강남의 중심지, 번화가의 상징', 37.4981, 127.0276, 1, 85, 'gangnam-station', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('가로수길', '강남의 트렌디한 거리, 카페와 쇼핑의 메카', 37.5200, 127.0230, 1, 88, 'garosugil', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 강남구 포스트 데이터 추가
INSERT INTO posts (title, content, author, image_url, photo_spot_id, created_at, updated_at) VALUES 
-- 강남역 관련 글들
('강남역에서 찍은 멋진 야경', '강남역 앞에서 찍은 도시의 야경이 정말 아름다웠습니다. 네온사인들이 반짝이는 모습이 환상적이었어요.', '포토그래퍼1', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('강남역 지하상가 탐방기', '강남역 지하상가의 활기찬 분위기를 담았습니다. 쇼핑하는 사람들의 모습이 인상적이었어요.', '쇼핑러버', 'https://images.unsplash.com/photo-1533748337487-49040c3b7db1?w=400&h=300&fit=crop', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('강남역 주변 카페 탐방', '강남역 주변의 다양한 카페들을 돌아보며 찍은 사진들입니다. 각각의 분위기가 독특했어요.', '카페헌터', 'https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=400&h=300&fit=crop', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 가로수길 관련 글들
('가로수길의 아름다운 가로수', '가로수길의 상징인 가로수들이 아름답게 늘어선 모습을 담았습니다. 계절별로 다른 모습이 매력적이에요.', '자연사랑', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&h=300&fit=crop', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('가로수길 카페 투어', '가로수길의 유명한 카페들을 돌아보며 찍은 사진들입니다. 각 카페의 독특한 인테리어가 인상적이었어요.', '카페투어', 'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=400&h=300&fit=crop', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('가로수길 쇼핑 스팟', '가로수길의 트렌디한 쇼핑 스팟들을 소개합니다. 독특한 디자인의 상점들이 많아서 구경하기 좋았어요.', '패션러버', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 포스트 태그 데이터 추가
INSERT INTO post_tags (post_id, tag) VALUES 
-- 강남역 포스트 태그들
(1, '야경'), (1, '강남역'), (1, '도시'),
(2, '지하상가'), (2, '쇼핑'), (2, '강남역'),
(3, '카페'), (3, '강남역'), (3, '맛집'),

-- 가로수길 포스트 태그들
(4, '가로수길'), (4, '자연'), (4, '가로수'),
(5, '카페'), (5, '가로수길'), (5, '인테리어'),
(6, '쇼핑'), (6, '가로수길'), (6, '패션');

-- 포스트 좋아요 데이터 추가 (베스트와 최신이 동일한 글을 가리키도록 설정)
INSERT INTO post_likes (post_id, user_id, created_at) VALUES 
-- 강남역 포스트들 (좋아요 순서대로 정렬되도록 설정)
-- 1번 글 (강남역 야경) - 15개 좋아요 (베스트 1위)
(1, 1, CURRENT_TIMESTAMP), (1, 2, CURRENT_TIMESTAMP), (1, 3, CURRENT_TIMESTAMP), (1, 4, CURRENT_TIMESTAMP), (1, 5, CURRENT_TIMESTAMP),
(1, 6, CURRENT_TIMESTAMP), (1, 7, CURRENT_TIMESTAMP), (1, 8, CURRENT_TIMESTAMP), (1, 9, CURRENT_TIMESTAMP), (1, 10, CURRENT_TIMESTAMP),
(1, 11, CURRENT_TIMESTAMP), (1, 12, CURRENT_TIMESTAMP), (1, 13, CURRENT_TIMESTAMP), (1, 14, CURRENT_TIMESTAMP), (1, 15, CURRENT_TIMESTAMP),

-- 2번 글 (강남역 지하상가) - 12개 좋아요 (베스트 2위)
(2, 1, CURRENT_TIMESTAMP), (2, 2, CURRENT_TIMESTAMP), (2, 3, CURRENT_TIMESTAMP), (2, 4, CURRENT_TIMESTAMP), (2, 5, CURRENT_TIMESTAMP),
(2, 6, CURRENT_TIMESTAMP), (2, 7, CURRENT_TIMESTAMP), (2, 8, CURRENT_TIMESTAMP), (2, 9, CURRENT_TIMESTAMP), (2, 10, CURRENT_TIMESTAMP),
(2, 11, CURRENT_TIMESTAMP), (2, 12, CURRENT_TIMESTAMP),

-- 3번 글 (강남역 카페) - 8개 좋아요 (베스트 3위)
(3, 1, CURRENT_TIMESTAMP), (3, 2, CURRENT_TIMESTAMP), (3, 3, CURRENT_TIMESTAMP), (3, 4, CURRENT_TIMESTAMP), (3, 5, CURRENT_TIMESTAMP),
(3, 6, CURRENT_TIMESTAMP), (3, 7, CURRENT_TIMESTAMP), (3, 8, CURRENT_TIMESTAMP),

-- 가로수길 포스트들
-- 4번 글 (가로수길 가로수) - 10개 좋아요 (베스트 4위)
(4, 1, CURRENT_TIMESTAMP), (4, 2, CURRENT_TIMESTAMP), (4, 3, CURRENT_TIMESTAMP), (4, 4, CURRENT_TIMESTAMP), (4, 5, CURRENT_TIMESTAMP),
(4, 6, CURRENT_TIMESTAMP), (4, 7, CURRENT_TIMESTAMP), (4, 8, CURRENT_TIMESTAMP), (4, 9, CURRENT_TIMESTAMP), (4, 10, CURRENT_TIMESTAMP),

-- 5번 글 (가로수길 카페) - 6개 좋아요 (베스트 5위)
(5, 1, CURRENT_TIMESTAMP), (5, 2, CURRENT_TIMESTAMP), (5, 3, CURRENT_TIMESTAMP), (5, 4, CURRENT_TIMESTAMP), (5, 5, CURRENT_TIMESTAMP),
(5, 6, CURRENT_TIMESTAMP),

-- 6번 글 (가로수길 쇼핑) - 4개 좋아요 (베스트 6위)
(6, 1, CURRENT_TIMESTAMP), (6, 2, CURRENT_TIMESTAMP), (6, 3, CURRENT_TIMESTAMP), (6, 4, CURRENT_TIMESTAMP); 
 
 
 
 
 