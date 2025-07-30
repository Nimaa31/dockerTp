pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('ghcr')
        GIT_REPO = 'https://github.com/Nimaa31/dockerTp.git'
    }

    stages {
        stage('Clone repository') {
            steps {
                echo 'Cloning manually...'
                withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
                        rm -rf dockerTp
                        git clone https://${GIT_USER}:${GIT_PASS}@github.com/Nimaa31/dockerTp.git
                        cd dockerTp
                    '''
                }
            }
        }

        stage('Run tests - Frontend') {
            steps {
                dir('dockerTp') {
                    sh '''
                        docker rm -f test-frontend || true
                        docker create --name test-frontend node:20 sh -c 'cd /app && npm install && npm test'
                        docker cp ./frontend/. test-frontend:/app
                        docker start -a test-frontend
                        docker rm test-frontend
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('dockerTp') {
                    sh '''
                        docker build -t nimaa31/docker-tp:latest ./frontend
                    '''
                }
            }
        }

        stage('Push to GitHub Packages') {
            steps {
                dir('dockerTp') {
                    script {
                        def versionTag = "v1.0.${env.BUILD_NUMBER}"
                        sh """
                            echo "${DOCKERHUB_CREDENTIALS_PSW}" | docker login ghcr.io -u "${DOCKERHUB_CREDENTIALS_USR}" --password-stdin
                            docker tag nimaa31/docker-tp:latest ghcr.io/nimaa31/docker-tp:latest
                            docker tag nimaa31/docker-tp:latest ghcr.io/nimaa31/docker-tp:${versionTag}
                            docker push ghcr.io/nimaa31/docker-tp:latest
                            docker push ghcr.io/nimaa31/docker-tp:${versionTag}
                        """
                    }
                }
            }
        }

        stage('Tag Git repo') {
            steps {
                dir('dockerTp') {
                    withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh '''
                            git config user.email "ci@todo.com"
                            git config user.name "CI Bot"
                            VERSION_TAG="v1.0.${BUILD_NUMBER}"
                            git tag -a $VERSION_TAG -m "Build $BUILD_NUMBER"
                            git push https://${GIT_USER}:${GIT_PASS}@github.com/Nimaa31/dockerTp.git --tags
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace"
            cleanWs()
        }
        failure {
            echo "Build failed"
        }
    }
}
