# Jenkins

Jenkins is a popular, free, open-source automation server that helps developers automate building, testing, and deploying software, facilitating Continuous Integration/Continuous Delivery (CI/CD).

## What is Jenkins? Why we use it?

- CI/CD automation tool
- Builds, tests, deploys Node.js apps
- Integrates with npm/yarn workflows

## Benefits of Jenkins

- Automates Node.js pipelines
- Supports JS frameworks (React, Angular, Vue)
- Plugin ecosystem for JS tools
- Works with GitHub/GitLab
- Scales with distributed builds

## Technologies covered through Jenkins

- Node.js
- npm / yarn
- Webpack
- Babel
- ESLint
- Jest / Mocha
- Cypress
- Docker + Kubernetes for JS apps

## Drawbacks of Jenkins

- Plugin overload for JS projects
- UI outdated vs modern JS CI/CD
- Manual pipeline setup needed
- Maintenance overhead
- Slower vs cloud-native CI/CD

## Alternatives to Jenkins

- GitHub Actions
- GitLab CI/CD
- CircleCI
- Travis CI
- Azure DevOps
- Vercel / Netlify (for JS apps)

## Architecture of Jenkins

- **Controller**: manages pipelines
- **Agents**: run Node.js builds/tests
- **Plugins**: npm, yarn, Docker, etc.
- **Pipeline**: scripted/declarative workflows

## Setup on Node.js Server

- Install Node.js & npm
- Use Jenkins alternatives (GitHub Actions, GitLab CI/CD) for pure JS
- If Jenkins required:
  - Use Dockerized Jenkins image
  - Configure Node.js inside container
  - Add npm/yarn steps in pipeline
- For local Node.js CI:
  - Use `npm run test` + GitHub Actions
  - Avoid Java dependency by using cloud CI/CD tools

## 📄 File

Jenkins doesn’t use a special file extension like .xml or .json for its pipelines. Instead, it relies on a plain text file named Jenkinsfile (with no extension).

Key points about the Jenkinsfile

- **Name** : Always Jenkinsfile (capital J, no extension).
- **Location** : Typically stored in the root of your project’s repository.
- **Format** : Written in Groovy-based DSL (Declarative or Scripted Pipeline syntax).
- **Purpose** : Defines your CI/CD pipeline steps (build, test, deploy).
- **Version control**: Because it’s part of your repo, Jenkins automatically picks it up when jobs are triggered.

```groovy
    pipeline {
        agent any
        stages {
            stage('Clean Up') {
                steps {
                    deleteDir()
                    }
                }
            stage('Checkout') {
                steps {
                    checkout scm
                    }
                }
            stage('Build') {
                steps {
                    dir('tests') {
                        sh 'node -v'
                        sh 'npm install'
                        sh 'npm run build'
                        }
                    }
                }
            stage('Test') {
                steps {
                    dir('tests') {
                        sh 'npm run test'
                    }
                }
            }
        }

        post {
            success { echo "✅ Build succeeded for branch ${env.BRANCH_NAME}" }
            failure { echo "❌ Build failed for branch ${env.BRANCH_NAME}" }
        }
    }
```

- Benefits

  - Each branch has its own CI/CD pipeline
  - Easy testing of feature branches before merging
  - Automatic PR builds for validation
  - Production deployment restricted to main branch

- Typical Use Cases
  - main → Production deployment
  - dev → Staging environment
  - feature/ → Run tests and builds only
  - hotfix/ → Quick patch pipelines



