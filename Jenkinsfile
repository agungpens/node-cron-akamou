pipeline {
    agent {
        node {
            label 'dsp'
        }
    }

    triggers {
        pollSCM('* * * * *')
    }

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'sudo docker build -t node-cron-akamou:latest .'
            }
        }

        stage('Run') {
            steps {
                sh 'sudo docker stop node-cron-akamou'
                sh 'sudo docker rm node-cron-akamou'
                sh 'sudo docker run -d --name node-cron-akamou -p 1234:1234 node-cron-akamou:latest'
            }
        }
    }
}
