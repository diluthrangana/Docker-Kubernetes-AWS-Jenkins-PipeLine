pipeline {
    agent any
    environment {
        DOCKER_IMAGE_BACKEND = 'diluthrangana/mern-backend'
        DOCKER_IMAGE_FRONTEND = 'diluthrangana/mern-frontend'
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
        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    bat 'echo|set /p="%DOCKER_PASSWORD%" | docker login -u %DOCKER_USERNAME% --password-stdin'
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
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: 'aws-credentials',
                                  accessKeyVariable: 'AWS_ACCESS_KEY_ID', 
                                  secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                    bat 'aws configure set aws_access_key_id %AWS_ACCESS_KEY_ID%'
                    bat 'aws configure set aws_secret_access_key %AWS_SECRET_ACCESS_KEY%'
                    bat "aws configure set region ${AWS_REGION}"
                }
            }
        }

        stage('Test Kubernetes Configuration') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    // Test if Kubernetes is accessible and check cluster health
                    bat '''
                        kubectl --kubeconfig=%KUBECONFIG% get nodes
                        kubectl --kubeconfig=%KUBECONFIG% cluster-info
                        kubectl --kubeconfig=%KUBECONFIG% get pods --all-namespaces
                    '''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    // Update deployment files with image tags
                    bat '''
                        powershell -Command "(Get-Content kubernetes\\backend-deployment.yaml) -replace '{{DOCKER_IMAGE_BACKEND}}','%DOCKER_IMAGE_BACKEND%:%DOCKER_TAG%' | Set-Content kubernetes\\backend-deployment.yaml"
                        powershell -Command "(Get-Content kubernetes\\frontend-deployment.yaml) -replace '{{DOCKER_IMAGE_FRONTEND}}','%DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG%' | Set-Content kubernetes\\frontend-deployment.yaml"
                        
                        kubectl --kubeconfig=%KUBECONFIG% apply -f kubernetes\\namespace.yaml
                        kubectl --kubeconfig=%KUBECONFIG% apply -f kubernetes\\mongodb-deployment.yaml
                        kubectl --kubeconfig=%KUBECONFIG% apply -f kubernetes\\backend-deployment.yaml
                        kubectl --kubeconfig=%KUBECONFIG% apply -f kubernetes\\frontend-deployment.yaml
                        kubectl --kubeconfig=%KUBECONFIG% apply -f kubernetes\\service.yaml
                    '''
                }
            }
        }
        stage('Setup Port Forwarding') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    // Start port forwarding in background
                    bat '''
                        start /B kubectl --kubeconfig=%KUBECONFIG% port-forward -n mern-app service/frontend 8080:80
                        echo Port forwarding started - Application accessible at http://localhost:8080
                    '''
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
