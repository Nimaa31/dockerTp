pipeline {
  agent {
    docker {
      image 'node:20' // Utilise un conteneur Node.js officiel
    }
  }

  environment {
    IMAGE_NAME = "ghcr.io/nimaa31/tptodo"
    VERSION = "v${BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/Nimaa31/dockerTp.git'
      }
    }

    stage('Install dependencies') {
      steps {
        dir('frontend') {
          sh 'npm install'
        }
      }
    }

    stage('Run Tests') {
      steps {
        dir('frontend') {
          sh 'npm run test -- --coverage'
        }
      }
    }

    stage('Build Docker image') {
      agent {
        docker {
          image 'docker:latest'
          args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
      }
      steps {
        sh 'docker build -t $IMAGE_NAME:$VERSION .'
      }
    }

    stage('Push to GitHub Packages') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'ghcr', usernameVariable: 'USERNAME', passwordVariable: 'TOKEN')]) {
          sh '''
            echo $TOKEN | docker login ghcr.io -u $USERNAME --password-stdin
            docker tag $IMAGE_NAME:$VERSION ghcr.io/$USERNAME/tptodo:$VERSION
            docker push ghcr.io/$USERNAME/tptodo:$VERSION
          '''
        }
      }
    }

    stage('Tag Git Repository') {
      steps {
        sh '''
          git config user.email "jenkins@example.com"
          git config user.name "jenkins"
          git tag -a $VERSION -m "Tag build $VERSION"
          git push origin $VERSION
        '''
      }
    }
  }

  post {
    failure {
      echo '❌ Build failed.'
    }
    success {
      echo '✅ Pipeline completed successfully!'
    }
  }
}
