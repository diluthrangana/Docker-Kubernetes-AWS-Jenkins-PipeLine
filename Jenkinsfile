pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')  // Change to your Jenkins credentials ID
        DOCKER_IMAGE_BACKEND = 'yourdockerhub/mern-backend'  // Change to your DockerHub username and image name
        DOCKER_IMAGE_FRONTEND = 'yourdockerhub/mern-frontend'  // Change to your DockerHub username and image name
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        AWS_REGION = 'us-east-1'  // Change to your AWS region
        KUBECONFIG = credentials('kubeconfig')  // Change to your Jenkins credentials ID
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('server') {
                    sh 'docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} .'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('client') {
                    sh 'docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} .'
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                sh 'echo $DOCKER_HUB_CREDS_PSW | docker login -u $DOCKER_HUB_CREDS_USR --password-stdin'
                sh 'docker push ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}'
                sh 'docker push ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}'
                sh 'docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:latest'
                sh 'docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:latest'
                sh 'docker push ${DOCKER_IMAGE_BACKEND}:latest'
                sh 'docker push ${DOCKER_IMAGE_FRONTEND}:latest'
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh 'mkdir -p $HOME/.kube'
                sh 'cat $KUBECONFIG > $HOME/.kube/config'
                
                sh "sed -i 's|{{DOCKER_IMAGE_BACKEND}}|${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}|g' kubernetes/backend-deployment.yaml"
                sh "sed -i 's|{{DOCKER_IMAGE_FRONTEND}}|${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}|g' kubernetes/frontend-deployment.yaml"
                
                sh 'kubectl apply -f kubernetes/namespace.yaml'
                sh 'kubectl apply -f kubernetes/mongodb-deployment.yaml'
                sh 'kubectl apply -f kubernetes/backend-deployment.yaml'
                sh 'kubectl apply -f kubernetes/frontend-deployment.yaml'
                sh 'kubectl apply -f kubernetes/service.yaml'
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
    }
}