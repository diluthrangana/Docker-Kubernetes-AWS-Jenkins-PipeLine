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
                bat 'aws configure set aws_access_key_id AKIA5HWLT4EWOR4P4NUH'
                bat 'aws configure set aws_secret_access_key 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'
                bat 'aws configure set region us-east-1'
            }
        }
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
                bat 'aws configure set aws_access_key_id AKIA5HWLT4EWOR4P4NUH'
                bat 'aws configure set aws_secret_access_key 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'
                bat 'aws configure set region us-east-1'
            }
        }
        stage('Deploy to Kubernetes') {
    steps {
        // Create kubeconfig directory if it doesn't exist
        bat 'if not exist %USERPROFILE%\\.kube mkdir %USERPROFILE%\\.kube'
        
        // Use withKubeConfig instead of manually handling the file
        withKubeConfig([credentialsId: 'kubeconfig', serverUrl: '']) {
            // Update deployment files with image tags
            bat 'powershell -Command "(Get-Content kubernetes\\backend-deployment.yaml) -replace \'{{DOCKER_IMAGE_BACKEND}}\',\'%DOCKER_IMAGE_BACKEND%:%DOCKER_TAG%\' | Set-Content kubernetes\\backend-deployment.yaml"'
            bat 'powershell -Command "(Get-Content kubernetes\\frontend-deployment.yaml) -replace \'{{DOCKER_IMAGE_FRONTEND}}\',\'%DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG%\' | Set-Content kubernetes\\frontend-deployment.yaml"'
            
            // Apply Kubernetes manifests
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
    post {
        always {
            bat 'docker logout'
            cleanWs()
        }
    }
}
