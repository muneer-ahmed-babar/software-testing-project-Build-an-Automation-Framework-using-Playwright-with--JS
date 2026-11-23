pipeline {
    agent any

    environment {
        IMAGE_NAME = 'saucedemo-playwright'
        CONTAINER  = "pw-run-${env.BUILD_NUMBER}"
    }

    triggers {
        githubPush()            // run on every GitHub push (webhook + ngrok)
        cron('H 2 * * *')       // also run every night around 2 AM
    }

    stages {
        stage('Checkout') {
            steps {
                deleteDir()     // start clean so old reports don't mix in
                checkout scm    // pull the code from GitHub
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% .'
            }
        }

        stage('Run UI + API Tests') {
            steps {
                // No --rm: the container must still exist so we can copy reports out of it
                bat 'docker run --name %CONTAINER% %IMAGE_NAME%:%BUILD_NUMBER%'
            }
        }
    }

    post {
        always {
            script {
                // Copy results out of the container, even when tests failed.
                // returnStatus keeps the build going if a folder doesn't exist (e.g. no failure screenshots).
                ['allure-results', 'playwright-report', 'screenshots', 'logs'].each { folder ->
                    bat(returnStatus: true, script: "docker cp %CONTAINER%:/app/${folder} .")
                }
                bat(returnStatus: true, script: 'docker rm -f %CONTAINER%')
            }
            archiveArtifacts artifacts: 'screenshots/**, logs/**, playwright-report/**', allowEmptyArchive: true
            allure includeProperties: false, results: [[path: 'allure-results']]
        }
    }
}
