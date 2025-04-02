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
        withCredentials([
            file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')
        ]) {
            // Configure AWS credentials
            bat 'aws configure set aws_access_key_id AKIA5HWLT4EWOR4P4NUH'
            bat 'aws configure set aws_secret_access_key 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'

            // First update kubeconfig with AWS auth
            bat 'aws eks update-kubeconfig --name mern cluster --region us-east-1'

            // Replace placeholders in deployment files
            bat 'powershell -Command "(Get-Content kubernetes\\backend-deployment.yaml) -replace \"{{DOCKER_IMAGE_BACKEND}}\",\"%DOCKER_IMAGE_BACKEND%:%DOCKER_TAG%\" | Set-Content kubernetes\\backend-deployment.yaml"'
            bat 'powershell -Command "(Get-Content kubernetes\\frontend-deployment.yaml) -replace \"{{DOCKER_IMAGE_FRONTEND}}\",\"%DOCKER_IMAGE_FRONTEND%:%DOCKER_TAG%\" | Set-Content kubernetes\\frontend-deployment.yaml"'

            // Deploy with explicit kubeconfig
            bat 'kubectl --kubeconfig=%KUBECONFIG_FILE% apply -f kubernetes\\namespace.yaml'
            bat 'kubectl --kubeconfig=%KUBECONFIG_FILE% apply -f kubernetes\\mongodb-deployment.yaml'
            bat 'kubectl --kubeconfig=%KUBECONFIG_FILE% apply -f kubernetes\\backend-deployment.yaml'
            bat 'kubectl --kubeconfig=%KUBECONFIG_FILE% apply -f kubernetes\\frontend-deployment.yaml'
            bat 'kubectl --kubeconfig=%KUBECONFIG_FILE% apply -f kubernetes\\service.yaml'
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
