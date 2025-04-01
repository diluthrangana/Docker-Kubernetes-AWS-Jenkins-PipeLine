pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDS = credentials('dockerhub_password')  // Updated to your Jenkins credentials ID
        DOCKER_IMAGE_BACKEND = 'diluthrangana/mern-backend'
        DOCKER_IMAGE_FRONTEND = 'diluthrangana/mern-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        AWS_REGION = 'us-east-1'
        KUBECONFIG = credentials('kubeconfig')  // Using your Jenkins credentials ID
        AWS_CREDENTIALS = credentials('aws-credentials')  // Added your AWS credentials
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
        
        stage('Configure AWS') {
            steps {
                sh 'aws configure set aws_access_key_id $AWS_CREDENTIALS_USR'
                sh 'aws configure set aws_secret_access_key $AWS_CREDENTIALS_PSW'
                sh 'aws configure set region ${AWS_REGION}'
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