pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('ghcr')
        VERSION_TAG = "v1.0.${BUILD_NUMBER}"
        IMAGE_NAME = "ghcr.io/nimaa31/tptodo"
    }

    stages {


        stage('Run tests - Frontend') {
            steps {
                echo "🧪 Running frontend tests in isolated container"
                sh '''
                    docker rm -f test-frontend || true
                    docker create --name test-frontend node:20 sh -c 'cd /app && npm install && npm test'
                    docker cp ./frontend/. test-frontend:/app
                    docker start -a test-frontend
                    docker rm test-frontend
                    echo "✅ Tests completed successfully"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🐳 Building Docker image"
                sh '''
                    docker build -t ${IMAGE_NAME}:latest ./frontend
                    docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${VERSION_TAG}
                    echo "✅ Docker image built and tagged"
                '''
            }
        }

        stage('Push to GitHub Packages') {
            steps {
                echo "📦 Pushing Docker image to GitHub Packages"
                sh '''
                    echo "${DOCKER_CREDENTIALS_PSW}" | docker login ghcr.io -u "${DOCKER_CREDENTIALS_USR}" --password-stdin

                    docker push ${IMAGE_NAME}:latest
                    docker push ${IMAGE_NAME}:${VERSION_TAG}

                    echo "✅ Image pushed: ${VERSION_TAG}"
                '''
            }
        }

stage('Tag Git Repository') {
  steps {
    echo "🏷️ Tagging GitHub repository"
    withCredentials([usernamePassword(credentialsId: 'ghcr-token', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
      sh '''
        rm -rf temp-repo
        git clone https://${GIT_USER}:${GIT_PASS}@github.com/Nimaa31/dockerTp.git temp-repo
        cd temp-repo
        git config user.email "jenkins@example.com"
        git config user.name "jenkins"
        VERSION_TAG="v1.0.${BUILD_NUMBER}"
        git tag -a $VERSION_TAG -m "Build $VERSION_TAG"
        git push origin $VERSION_TAG
        echo "✅ Git repo tagged"
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
