#!/bin/bash

# WebFroPhto 모니터링 스크립트

LOG_FILE="/var/log/webfrophto-monitor.log"
ALERT_EMAIL="admin@yourcompany.com"

# 로그 함수
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

# 알림 함수
alert() {
    log "🚨 ALERT: $1"
    echo "$1" | mail -s "WebFroPhto Alert" $ALERT_EMAIL
}

# 헬스 체크
check_health() {
    log "🏥 헬스 체크 시작..."
    
    # 백엔드 체크
    if ! curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
        alert "백엔드 서비스가 응답하지 않습니다"
        return 1
    fi
    
    # 프론트엔드 체크
    if ! curl -f http://localhost:3000 > /dev/null 2>&1; then
        alert "프론트엔드 서비스가 응답하지 않습니다"
        return 1
    fi
    
    log "✅ 모든 서비스 정상"
    return 0
}

# 리소스 사용량 체크
check_resources() {
    log "📊 리소스 사용량 체크..."
    
    # CPU 사용량
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
        alert "CPU 사용량이 높습니다: ${CPU_USAGE}%"
    fi
    
    # 메모리 사용량
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
    if (( $(echo "$MEMORY_USAGE > 80" | bc -l) )); then
        alert "메모리 사용량이 높습니다: ${MEMORY_USAGE}%"
    fi
    
    # 디스크 사용량
    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | cut -d'%' -f1)
    if [ "$DISK_USAGE" -gt 80 ]; then
        alert "디스크 사용량이 높습니다: ${DISK_USAGE}%"
    fi
    
    log "📈 CPU: ${CPU_USAGE}%, Memory: ${MEMORY_USAGE}%, Disk: ${DISK_USAGE}%"
}

# Docker 컨테이너 상태 체크
check_containers() {
    log "🐳 Docker 컨테이너 상태 체크..."
    
    # 실행 중인 컨테이너 수
    RUNNING_CONTAINERS=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep -c "Up")
    TOTAL_CONTAINERS=$(docker ps -a --format "table {{.Names}}\t{{.Status}}" | grep -c "webfrophto")
    
    if [ "$RUNNING_CONTAINERS" -lt "$TOTAL_CONTAINERS" ]; then
        alert "일부 Docker 컨테이너가 중지되었습니다"
        docker ps -a | grep webfrophto >> $LOG_FILE
    fi
    
    log "✅ Docker 컨테이너 상태 정상"
}

# 데이터베이스 연결 체크
check_database() {
    log "🗄️ 데이터베이스 연결 체크..."
    
    # PostgreSQL 연결 체크
    if ! docker exec webfrophto-postgres-1 pg_isready -U postgres > /dev/null 2>&1; then
        alert "데이터베이스 연결에 실패했습니다"
        return 1
    fi
    
    log "✅ 데이터베이스 연결 정상"
}

# 로그 파일 크기 체크
check_logs() {
    log "📝 로그 파일 크기 체크..."
    
    # Jenkins 로그 크기
    JENKINS_LOG_SIZE=$(du -m /var/log/jenkins/jenkins.log | cut -f1)
    if [ "$JENKINS_LOG_SIZE" -gt 1000 ]; then
        log "⚠️ Jenkins 로그 파일이 큽니다: ${JENKINS_LOG_SIZE}MB"
        # 로그 로테이션
        sudo logrotate -f /etc/logrotate.d/jenkins
    fi
    
    # 애플리케이션 로그 크기
    APP_LOG_SIZE=$(du -m /opt/webfrophto/logs/*.log 2>/dev/null | awk '{sum+=$1} END {print sum+0}')
    if [ "$APP_LOG_SIZE" -gt 500 ]; then
        log "⚠️ 애플리케이션 로그 파일이 큽니다: ${APP_LOG_SIZE}MB"
    fi
}

# 백업 상태 체크
check_backups() {
    log "📦 백업 상태 체크..."
    
    BACKUP_DIR="/opt/backups/webfrophto"
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/webfrophto_*.tar.gz 2>/dev/null | head -1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        alert "백업 파일이 없습니다"
        return 1
    fi
    
    # 백업 파일 나이 체크 (24시간)
    BACKUP_AGE=$(($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")))
    if [ "$BACKUP_AGE" -gt 86400 ]; then
        alert "백업 파일이 오래되었습니다: $(($BACKUP_AGE / 3600))시간 전"
    fi
    
    log "✅ 백업 상태 정상"
}

# 메인 실행
main() {
    log "🔍 WebFroPhto 모니터링 시작"
    
    check_health
    check_resources
    check_containers
    check_database
    check_logs
    check_backups
    
    log "✅ 모니터링 완료"
}

# 스크립트 실행
main "$@" 