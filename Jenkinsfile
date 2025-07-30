pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('ghcr')
        VERSION_TAG = "v1.0.${BUILD_NUMBER}"
        IMAGE_NAME = "ghcr.io/nimaa31/tptodo"
    }

    stages {
        stage('Checkout') {
            steps {
                echo "📥 Cloning repository..."
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir('frontend') {
                    echo "📦 Installing dependencies"
                    sh 'npm install'
                }
            }
        }

        stage('Run tests') {
            steps {
                echo "🧪 Running tests in Docker"
                sh '''
                    docker rm -f test-frontend || true
                    docker create --name test-frontend node:20 sh -c 'cd /app && npm install && npm test'
                    docker cp ./frontend/. test-frontend:/app
                    docker start -a test-frontend
                    docker rm test-frontend
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image"
                sh """
                    docker build -t ${IMAGE_NAME}:latest ./frontend
                    docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${VERSION_TAG}
                """
            }
        }

        stage('Push to GHCR') {
            steps {
                echo "🚀 Pushing image to GitHub Packages"
                sh '''
                    echo "${DOCKER_CREDENTIALS_PSW}" | docker login ghcr.io -u "${DOCKER_CREDENTIALS_USR}" --password-stdin
                    docker push ${IMAGE_NAME}:latest
                    docker push ${IMAGE_NAME}:${VERSION_TAG}
                '''
            }
        }

        stage('Git Tag') {
            steps {
                echo "🏷️ Tagging repository"
                withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
                        rm -rf temp-repo
                        git clone https://${GIT_USER}:${GIT_PASS}@github.com/Nimaa31/dockerTp.git temp-repo
                        cd temp-repo
                        git config user.name "jenkins"
                        git config user.email "jenkins@example.com"
                        VERSION_TAG="v1.0.${BUILD_NUMBER}"
                        git tag -a $VERSION_TAG -m "Build $VERSION_TAG"
                        git push origin $VERSION_TAG
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "🧹 Cleaning up workspace"
            cleanWs()
        }
        failure {
            echo "❌ Build failed"
        }
    }
}
