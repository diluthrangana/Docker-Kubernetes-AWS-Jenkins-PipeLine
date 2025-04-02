pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDS = credentials('dockerhub_password')
        DOCKER_IMAGE_BACKEND = 'yourdockerhub/mern-backend'
        DOCKER_IMAGE_FRONTEND = 'yourdockerhub/mern-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        AWS_REGION = 'us-east-1'
        KUBECONFIG = credentials('kubeconfig')
        AWS_CREDENTIALS = credentials('aws-credentials')
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
        
        stage('Push to DockerHub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub_password', variable: 'DOCKER_PWD')]) {
                    bat 'docker login -u %DOCKER_HUB_CREDS_USR% -p %DOCKER_HUB_CREDS_PSW%'
                    bat 'docker push %DOCKER_IMAGE_BACKEND%:%DOCKER_TAG%'
                    bat 'docker push %DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG%'
                    bat 'docker tag %DOCKER_IMAGE_BACKEND%:%DOCKER_TAG% %DOCKER_IMAGE_BACKEND%:latest'
                    bat 'docker tag %DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG% %DOCKER_IMAGE_FRONTEND%:latest'
                    bat 'docker push %DOCKER_IMAGE_BACKEND%:latest'
                    bat 'docker push %DOCKER_IMAGE_FRONTEND%:latest'
                }
            }
        }
        
        stage('Configure AWS') {
    steps {
        bat 'aws configure set aws_access_key_id AKIA5HWLT4EWOR4P4NUH'
        bat 'aws configure set aws_secret_access_key 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'
        bat 'aws configure set region us-east-1'
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
