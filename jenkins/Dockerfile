FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y \
    docker.io \
    curl \
    gnupg \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

RUN usermod -aG docker jenkins

RUN mkdir -p /app/frontend /app/backend && chown -R jenkins:jenkins /app

USER jenkins
