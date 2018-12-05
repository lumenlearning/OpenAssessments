#!/usr/bin/env groovy

@Library('lumen-helpers@master') _

String APP_NAME = "OEA"
String APP_DESCRIPTION = "Open Assessments"

String EB_APP_NAME_STAGING = "OpenAssessments-stg"
String EB_APP_NAME_PROD = "OpenAssessments"

String EB_ENV_NAME_DEV = "openassessments-dev-env"
String EB_ENV_NAME_STAGING = "openassessments-stg2"
String EB_ENV_NAME_PROD = "openassessments-prod4"

pipeline {
  agent none

  options {
    buildDiscarder(logRotator(daysToKeepStr: '14'))
    skipDefaultCheckout true
    skipStagesAfterUnstable()
  }

  environment {
    GEMFURY_KEY = credentials("GEMFURY_KEY")
    BUNDLE_REPO__FURY__IO = credentials("GEMFURY_KEY")
    NPM_CONFIG_REGISTRY = "https://npm-proxy.fury.io/${env.GEMFURY_KEY}/lumendev/"
  }

  parameters {
    booleanParam(defaultValue: false, description: 'Should the Test phase be skipped?', name: 'SKIP_TESTS_REQUESTED')
    booleanParam(defaultValue: false, description: 'Should the deployment to Dev phase be skipped?', name: 'DEV_DEPLOYMENT_REQUESTED')
    booleanParam(defaultValue: false, description: 'Deploy to staging?', name: 'STAGING_DEPLOYMENT_REQUESTED')
    booleanParam(defaultValue: false, description: 'Deploy to Prod?', name: 'PROD_DEPLOYMENT_REQUESTED')
  }

  stages {
    stage('Setup') {
      agent { label 'ruby' }

      steps {
        checkout scm

        script {
          buildSetup appName: APP_NAME
        }
      }
    }

    stage('Install Dependencies') {
      agent {
        docker { image 'ruby222-postgres94-node012:latest' }
      }

      failFast true

      steps {
        sh 'cp config/secrets.yml.example config/secrets.yml'
        sh 'cp config/database.yml.example config/database.yml'

        sh """
          bundle install --deployment
          bundle package
        """

        sh 'cd client && npm install && cd ..'
        sh 'bundle exec rake assets:webpack'
        sh 'bundle exec rake assets:precompile'

        stash includes: 'config/secrets.yml,config/database.yml', name: 'local-config'
        stash includes: 'vendor/', name: 'vendor'
        stash includes: 'client/node_modules/', name: 'node_modules'
        stash includes: 'public/assets/', name: 'assets'

        sh 'rm -r client/node_modules'
      }
    }

    stage('Test') {
      when {
        expression { params.SKIP_TESTS_REQUESTED == false }
      }

      agent {
        docker { image 'ruby222-postgres94-node012:latest' }
      }

      failFast true

      steps {
        unstash 'local-config'
        unstash 'vendor'

        sh 'bundle install --with=test'
        sh 'bundle exec rake db:create'
        sh 'bundle exec rspec'
      }
    }

    stage('Artifact') {
      agent { label 'ruby' }

      failFast true

      steps {
        unstash 'assets'
        unstash 'vendor'

        compressDirectory('./', 'bundle.zip')

        script {
          if (env.DEV_DEPLOYMENT_REQUESTED == 'true' || env.STAGING_DEPLOYMENT_REQUESTED == 'true') {
            uploadFileToS3('staging', 'bundle.zip', env.S3_ARTIFACT_URL_STG)

            createElasticBeanstalkVersion(
              'staging',
              EB_APP_NAME_STAGING,
              env.BUILD_LABEL,
              env.S3_ARTIFACTS_BUCKET_STG,
              env.S3_ARTIFACT_PATH
            )
          }

          if (env.PROD_DEPLOYMENT_REQUESTED == 'true') {
            uploadFileToS3('production', 'bundle.zip', env.S3_ARTIFACT_URL_PROD)

            createElasticBeanstalkVersion(
              'production',
              EB_APP_NAME_PROD,
              env.BUILD_LABEL,
              env.S3_ARTIFACTS_BUCKET_PROD,
              env.S3_ARTIFACT_PATH
            )
          }
        }

        stash includes: 'bundle.zip', name: 'artifact'
      }

      post {
        always { cleanWs(notFailBuild: true) }
      }
    }

    stage('Deploy to Dev/Staging') {
      when {
        expression {
          env.DEV_DEPLOYMENT_REQUESTED == 'true' || env.STAGING_DEPLOYMENT_REQUESTED == 'true'
        }
      }

      failFast true

      parallel {
        stage('Deploy to Dev') {
          when {
            expression { env.DEV_DEPLOYMENT_REQUESTED == 'true' }
          }

          agent { label 'ruby' }

          steps {
            script {
              deployToElasticBeanstalk([
                deployName: 'Dev',
                profile: 'staging',
                appName: EB_APP_NAME_STAGING,
                envName: EB_ENV_NAME_DEV,
                buildLabel: env.BUILD_LABEL
              ])
            }
          }
        }

        stage('Deploy to Staging') {
          when {
            expression { env.STAGING_DEPLOYMENT_REQUESTED == 'true' }
          }

          agent { label 'ruby' }

          steps {
            script {
              deployToElasticBeanstalk([
                deployName: 'Staging',
                profile: 'staging',
                appName: EB_APP_NAME_STAGING,
                envName: EB_ENV_NAME_STAGING,
                buildLabel: env.BUILD_LABEL
              ])
            }
          }
        }
      }
    }

    stage('Confirm Prod Deploy') {
      agent none

      when {
        expression { env.PROD_DEPLOYMENT_REQUESTED == 'true' }
      }

      steps {
        script {
          slackSendProdConfirmation(
            buildLabel: env.BUILD_LABEL,
            userLabel: env.WHO_STARTED_BUILD
          )
        }

        input(message: 'Deploy to Production?')
      }
    }

    stage('Deploy to Prod') {
      when {
        expression { env.PROD_DEPLOYMENT_REQUESTED == 'true' }
      }

      agent { label 'ruby' }

      steps {
        script {
          deployToElasticBeanstalk([
            deployName: 'Prod',
            profile: 'production',
            appName: EB_APP_NAME_PROD,
            envName: EB_ENV_NAME_PROD,
            buildLabel: env.BUILD_LABEL
          ])

          slackSendProdRelease(
            appName: APP_NAME,
            appDesc: APP_DESCRIPTION
          )
        }
      }

      post {
        always { cleanWs(notFailBuild: true) }
      }
    }
  }

  post {
    always {
      script {
        buildWrapup(result: currentBuild.currentResult)
      }
    }
  }
}
