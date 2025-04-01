pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE_BACKEND = 'diluthrangana/mern-backend'
        DOCKER_IMAGE_FRONTEND = 'diluthrangana/mern-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        AWS_REGION = 'us-east-1'
        KUBECONFIG = credentials('kubeconfig')
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
                    bat 'docker build -t %DOCKER_IMAGE_BACKEND%:%DOCKER_TAG% .'
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('client') {
                    bat 'docker build -t %DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG% .'
                }
            }
        }
        
        stage('Login to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub_password', variable: 'DOCKER_PASSWORD')]) {
                    script {
                        bat "docker login -u yourdockerhub -p %DOCKER_PASSWORD%"
                    }
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                bat 'docker push %DOCKER_IMAGE_BACKEND%:%DOCKER_TAG%'
                bat 'docker push %DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG%'
                bat 'docker tag %DOCKER_IMAGE_BACKEND%:%DOCKER_TAG% %DOCKER_IMAGE_BACKEND%:latest'
                bat 'docker tag %DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG% %DOCKER_IMAGE_FRONTEND%:latest'
                bat 'docker push %DOCKER_IMAGE_BACKEND%:latest'
                bat 'docker push %DOCKER_IMAGE_FRONTEND%:latest'
            }
        }
        
        stage('Configure AWS') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY'),
                    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_KEY')
                ]) {
                    bat 'aws configure set aws_access_key_id %AWS_ACCESS_KEY%'
                    bat 'aws configure set aws_secret_access_key %AWS_SECRET_KEY%'
                    bat 'aws configure set region %AWS_REGION%'
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                bat 'if not exist %USERPROFILE%\\.kube mkdir %USERPROFILE%\\.kube'
                bat 'echo %KUBECONFIG% > %USERPROFILE%\\.kube\\config'
                
                bat 'powershell -Command "(Get-Content kubernetes\\backend-deployment.yaml) -replace \'{{DOCKER_IMAGE_BACKEND}}\',\'%DOCKER_IMAGE_BACKEND%:%DOCKER_TAG%\' | Set-Content kubernetes\\backend-deployment.yaml"'
                bat 'powershell -Command "(Get-Content kubernetes\\frontend-deployment.yaml) -replace \'{{DOCKER_IMAGE_FRONTEND}}\',\'%DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG%\' | Set-Content kubernetes\\frontend-deployment.yaml"'
                
                bat 'kubectl apply -f kubernetes\\namespace.yaml'
                bat 'kubectl apply -f kubernetes\\mongodb-deployment.yaml'
                bat 'kubectl apply -f kubernetes\\backend-deployment.yaml'
                bat 'kubectl apply -f kubernetes\\frontend-deployment.yaml'
                bat 'kubectl apply -f kubernetes\\service.yaml'
            }
        }
    }
    
    post {
        always {
            bat 'docker logout'
            cleanWs()
        }
    }
}
