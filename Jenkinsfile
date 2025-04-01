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
                // Updated Docker login to use the proper password-stdin approach
                bat 'echo %DOCKER_HUB_CREDS_PSW% | docker login -u %DOCKER_HUB_CREDS_USR% --password-stdin'
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
                // Using AWS_CREDENTIALS binding properly
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: 'aws-credentials', 
                                  accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                  secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    bat 'aws configure set aws_access_key_id %AWS_ACCESS_KEY_ID%'
                    bat 'aws configure set aws_secret_access_key %AWS_SECRET_ACCESS_KEY%'
                    bat 'aws configure set region %AWS_REGION%'
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                // Using a more reliable approach for kubeconfig
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIGFILE')]) {
                    bat 'if not exist %USERPROFILE%\\.kube mkdir %USERPROFILE%\\.kube'
                    bat 'copy /Y %KUBECONFIGFILE% %USERPROFILE%\\.kube\\config'
                    
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
    }
    
    post {
        always {
            bat 'docker logout'
            cleanWs()
        }
    }
}
