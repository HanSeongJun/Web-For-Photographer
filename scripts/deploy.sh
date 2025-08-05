#!/bin/bash

# WebFroPhto 배포 스크립트
# 사용법: ./deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-production}
DEPLOY_DIR="/opt/webfrophto"
BACKUP_DIR="/opt/backups/webfrophto"

echo "🚀 WebFroPhto 배포 시작 - 환경: $ENVIRONMENT"

# 백업 생성
backup() {
    echo "📦 백업 생성 중..."
    mkdir -p $BACKUP_DIR
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    
    if [ -d "$DEPLOY_DIR" ]; then
        tar -czf "$BACKUP_DIR/webfrophto_${TIMESTAMP}.tar.gz" -C /opt webfrophto
        echo "✅ 백업 완료: $BACKUP_DIR/webfrophto_${TIMESTAMP}.tar.gz"
    fi
}

# 환경 변수 설정
setup_environment() {
    echo "🔧 환경 변수 설정 중..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        export WEATHER_API_KEY="your-production-weather-api-key"
        export AIR_QUALITY_API_KEY="your-production-air-quality-api-key"
        export JWT_SECRET="your-production-jwt-secret"
        export DATABASE_URL="postgresql://user:pass@prod-db:5432/webfrophto"
    else
        export WEATHER_API_KEY="your-staging-weather-api-key"
        export AIR_QUALITY_API_KEY="your-staging-air-quality-api-key"
        export JWT_SECRET="your-staging-jwt-secret"
        export DATABASE_URL="postgresql://user:pass@staging-db:5432/webfrophto"
    fi
}

# Docker 이미지 업데이트
update_images() {
    echo "🐳 Docker 이미지 업데이트 중..."
    
    # 최신 이미지 가져오기
    docker-compose pull
    
    # 기존 컨테이너 중지
    docker-compose down
    
    # 새 컨테이너 시작
    docker-compose up -d
    
    # 사용하지 않는 이미지 정리
    docker system prune -f
}

# 헬스 체크
health_check() {
    echo "🏥 헬스 체크 중..."
    
    # 백엔드 헬스 체크
    for i in {1..30}; do
        if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
            echo "✅ 백엔드 헬스 체크 성공"
            break
        fi
        
        if [ $i -eq 30 ]; then
            echo "❌ 백엔드 헬스 체크 실패"
            exit 1
        fi
        
        sleep 2
    done
    
    # 프론트엔드 헬스 체크
    for i in {1..30}; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "✅ 프론트엔드 헬스 체크 성공"
            break
        fi
        
        if [ $i -eq 30 ]; then
            echo "❌ 프론트엔드 헬스 체크 실패"
            exit 1
        fi
        
        sleep 2
    done
}

# 롤백
rollback() {
    echo "🔄 롤백 실행 중..."
    
    # 최신 백업 찾기
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/webfrophto_*.tar.gz | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        echo "📦 백업에서 복원: $LATEST_BACKUP"
        
        # 현재 배포 중지
        docker-compose down
        
        # 백업에서 복원
        rm -rf $DEPLOY_DIR
        tar -xzf "$LATEST_BACKUP" -C /opt
        
        # 이전 버전으로 재시작
        cd $DEPLOY_DIR
        docker-compose up -d
        
        echo "✅ 롤백 완료"
    else
        echo "❌ 롤백할 백업이 없습니다"
        exit 1
    fi
}

# 메인 실행
main() {
    cd $DEPLOY_DIR
    
    # 백업 생성
    backup
    
    # 환경 변수 설정
    setup_environment
    
    # 이미지 업데이트
    update_images
    
    # 헬스 체크
    health_check
    
    echo "✅ 배포 완료!"
    echo "🌐 프론트엔드: http://localhost:3000"
    echo "🔧 백엔드 API: http://localhost:8080/api"
}

# 스크립트 실행
if [ "$1" = "rollback" ]; then
    rollback
else
    main
fi 