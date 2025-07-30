pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = credentials('ghcr') // ID du token GitHub dans Jenkins
        IMAGE_NAME = "ghcr.io/nimaa31/tptodo"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
            }
        }

        stage('Push to GitHub Packages') {
            steps {
                withDockerRegistry([url: 'https://ghcr.io', credentialsId: 'ghcr']) {
                    sh 'docker push $IMAGE_NAME:$BUILD_NUMBER'
                }
            }
        }

        stage('Tag Repository') {
            steps {
                sh """
                git config user.email "jenkins@example.com"
                git config user.name "jenkins"
                git tag v$BUILD_NUMBER
                git push https://$GITHUB_CREDENTIALS@github.com/Nimaa31/dockerTp.git --tags
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
