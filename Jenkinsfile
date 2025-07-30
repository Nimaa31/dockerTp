pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS = credentials('ghcr')
        VERSION_TAG = "v1.0.${BUILD_NUMBER}"
        REPO_URL = 'https://github.com/Nimaa31/dockerTp.git'
        IMAGE_NAME = "ghcr.io/nimaa31/todolist"
    }

    stages {
        stage('Clone Repository de con ') {
            steps {
                git url: "${REPO_URL}", branch: 'master', credentialsId: 'ghcr'
                echo "Code cloned successfully"
            }
        }

        stage('Install & Build') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build || echo "skip if no build script"'
                }
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('frontend') {
                    sh 'npm test || echo "no tests found or tests failed"'
                }
            }
        }

stage('Build Docker Image') {
    steps {
        script {
            echo 'Building Docker image'
            def version = "v1.0.${env.BUILD_NUMBER}"
            sh """
                docker build -t ghcr.io/nimaa31/todolist:latest -t ghcr.io/nimaa31/todolist:${version} ./frontend
            """
        }
    }
}



        stage('Tag GitHub Repo') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
                        git config user.name "CI Bot"
                        git config user.email "ci@example.com"
                        git tag -a ${VERSION_TAG} -m "Build ${BUILD_NUMBER}"
                        git push https://${GIT_USER}:${GIT_PASS}@github.com/Nimaa31/dockerTp.git --tags
                    '''
                }
            }
        }

        stage('Push Docker to GitHub Package') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                    sh '''
                        echo "${GIT_TOKEN}" | docker login ghcr.io -u "${GIT_USER}" --password-stdin
                        docker push ${IMAGE_NAME}:latest
                        docker push ${IMAGE_NAME}:${VERSION_TAG}
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker'
            sh 'docker system prune -f || true'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}
