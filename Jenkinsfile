pipeline {
    agent any
    environment {
        DOCKER_IMAGE_BACKEND = 'diluthrangana/mern-backend'
        DOCKER_IMAGE_FRONTEND = 'diluthrangana/mern-frontend'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        AWS_REGION = 'us-east-1'
        KUBECONFIG = credentials('kubeconfig')
        AWS_CREDENTIALS = credentials('aws-credentials')
        // Add environment variable to store the local port
        LOCAL_PORT = "8080"
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
        
        // New stage to set up port forwarding
        stage('Setup Port Forwarding') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    script {
                        // Wait for pods to be ready
                        bat '''
                            echo "Waiting for frontend pods to be ready..."
                            kubectl --kubeconfig=%KUBECONFIG% -n mern-app wait --for=condition=ready pod -l app=frontend --timeout=300s
                        '''
                        
                        // Start port-forward in the background and save its process ID
                        bat '''
                            echo "Starting port forwarding..."
                            
                            REM Check if port is already in use and kill the process if needed
                            FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr ":%LOCAL_PORT%"') DO (
                                IF NOT "%%P"=="" (
                                    echo "Port %LOCAL_PORT% is in use by process %%P, attempting to terminate..."
                                    taskkill /F /PID %%P
                                    timeout /t 2
                                )
                            )
                            
                            REM Start the port-forwarding in a separate process
                            start /b cmd /c "kubectl --kubeconfig=%KUBECONFIG% -n mern-app port-forward service/frontend %LOCAL_PORT%:80 > port-forward.log 2>&1"
                            
                            REM Save the connection info to a file
                            echo "Application available at: http://localhost:%LOCAL_PORT%" > connection-info.txt
                            echo "Port forwarding has been set up. You can access the application at: http://localhost:%LOCAL_PORT%"
                            echo "Note: This port-forward will remain active for the duration of this Jenkins job."
                            echo "To access the application after the job completes, you'll need to run the port-forward command manually."
                        '''
                        
                        // Archive the connection info
                        archiveArtifacts artifacts: 'connection-info.txt', allowEmptyArchive: true
                        archiveArtifacts artifacts: 'port-forward.log', allowEmptyArchive: true
                        
                        // Give time for port-forwarding to establish
                        bat 'timeout /t 5'
                        
                        // Test the connection
                        bat '''
                            echo "Testing connection to the application..."
                            powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:%LOCAL_PORT%' -Method Head -TimeoutSec 10 | Out-Null; Write-Host 'Connection successful!' } catch { Write-Host 'Connection failed: ' $_.Exception.Message }"
                        '''
                    }
                }
            }
        }
    }
    post {
        always {
            bat 'docker logout'
            
            // Cleanup port-forwarding process before cleaning workspace
            bat '''
                echo "Cleaning up port-forwarding process..."
                FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr ":%LOCAL_PORT%"') DO (
                    IF NOT "%%P"=="" (
                        echo "Terminating process %%P using port %LOCAL_PORT%..."
                        taskkill /F /PID %%P 2>nul
                    )
                )
            '''
            
            cleanWs()
        }
        success {
            echo "Deployment completed successfully. You can access the application at: http://localhost:${LOCAL_PORT}"
            echo "Note: The port-forwarding will stop when this Jenkins job completes."
        }
    }
}
