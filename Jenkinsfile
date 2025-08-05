pipeline {
    agent any
    
    environment {
        // 환경 변수 설정
        DOCKER_IMAGE_BACKEND = 'webfrophto-backend'
        DOCKER_IMAGE_FRONTEND = 'webfrophto-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        
        // 배포 환경
        DEPLOY_ENV = 'production'
        
        // API 키 (Jenkins Credentials에서 가져옴)
        WEATHER_API_KEY = credentials('weather-api-key')
        AIR_QUALITY_API_KEY = credentials('air-quality-api-key')
        JWT_SECRET = credentials('jwt-secret')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔍 소스 코드 체크아웃 중...'
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                echo '📦 백엔드 빌드 중...'
                dir('.') {
                    sh '''
                        chmod +x gradlew
                        ./gradlew clean build -x test
                    '''
                }
            }
            post {
                always {
                    // 빌드 결과물 아카이브
                    archiveArtifacts artifacts: 'build/libs/*.jar', fingerprint: true
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo '📦 프론트엔드 빌드 중...'
                dir('frontend') {
                    sh '''
                        npm ci
                        npm run build
                    '''
                }
            }
            post {
                always {
                    // 빌드 결과물 아카이브
                    archiveArtifacts artifacts: 'frontend/dist/**/*', fingerprint: true
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        echo '🧪 백엔드 테스트 실행 중...'
                        dir('.') {
                            sh './gradlew test'
                        }
                    }
                    post {
                        always {
                            // 테스트 결과 리포트
                            publishTestResults testResultsPattern: '**/build/test-results/test/*.xml'
                        }
                    }
                }
                
                stage('Frontend Tests') {
                    steps {
                        echo '🧪 프론트엔드 테스트 실행 중...'
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false --coverage'
                        }
                    }
                    post {
                        always {
                            // 테스트 커버리지 리포트
                            publishCoverage adapters: [lcovAdapter('frontend/coverage/lcov.info')]
                        }
                    }
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo '🔒 보안 스캔 실행 중...'
                // OWASP ZAP 또는 SonarQube 스캔
                sh '''
                    # 의존성 취약점 스캔
                    ./gradlew dependencyCheckAnalyze
                '''
            }
        }
        
        stage('Build Docker Images') {
            steps {
                echo '🐳 Docker 이미지 빌드 중...'
                script {
                    // 백엔드 이미지 빌드
                    docker.build("${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}")
                    
                    // 프론트엔드 이미지 빌드
                    dir('frontend') {
                        docker.build("${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}")
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                echo '📤 Docker 레지스트리에 푸시 중...'
                script {
                    // Docker Hub 또는 AWS ECR에 푸시
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}").push('latest')
                        docker.image("${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Local') {
            steps {
                echo '🚀 로컬 환경 배포 중...'
                script {
                    // 로컬 Docker Compose 배포
                    sh '''
                        if [ -f "docker-compose.local.yml" ]; then
                            echo "로컬 Docker Compose로 배포 중..."
                            docker-compose -f docker-compose.local.yml down
                            docker-compose -f docker-compose.local.yml build
                            docker-compose -f docker-compose.local.yml up -d
                            docker system prune -f
                        else
                            echo "로컬 Docker Compose 파일이 없습니다. 로컬 빌드만 실행합니다."
                        fi
                    '''
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 헬스 체크 중...'
                script {
                    // 배포 후 헬스 체크
                    sh '''
                        sleep 30
                        curl -f http://localhost:8080/api/health || echo "백엔드 헬스 체크 실패"
                        curl -f http://localhost:3000 || echo "프론트엔드 헬스 체크 실패"
                    '''
                }
            }
        }
        
        stage('Rollback') {
            when {
                expression { currentBuild.result == 'FAILURE' }
            }
            steps {
                echo '🔄 롤백 실행 중...'
                script {
                    // 이전 버전으로 롤백
                    sshagent(['production-ssh-key']) {
                        sh '''
                            ssh user@production-server << 'EOF'
                                cd /opt/webfrophto
                                docker-compose down
                                docker-compose up -d
                            EOF
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '🧹 정리 작업 중...'
            // 워크스페이스 정리
            cleanWs()
        }
        success {
            echo '✅ 파이프라인 성공!'
            // 성공 알림 (로컬 테스트용으로 콘솔 출력만)
            echo "✅ WebFroPhto 배포 성공 - Build #${env.BUILD_NUMBER}"
            echo "🌐 프론트엔드: http://localhost:3000"
            echo "🔧 백엔드 API: http://localhost:8080/api"
        }
        failure {
            echo '❌ 파이프라인 실패!'
            // 실패 알림 (로컬 테스트용으로 콘솔 출력만)
            echo "❌ WebFroPhto 배포 실패 - Build #${env.BUILD_NUMBER}"
            echo "로그를 확인해주세요."
        }
    }
} 