# Multibranch Pipeline Notes

## 🌱 What is a Multibranch Pipeline?
- **Branch-aware automation**: Jenkins scans your Git repository and creates pipelines for each branch automatically.
- **Pipeline as code**: Each branch can have its own `Jenkinsfile` defining build/test/deploy steps.
- **Dynamic job creation**: No need to manually add jobs when new branches are created.
- **Consistency across environments**: Ensures dev, QA, and production branches follow the same CI/CD rules.

---

## ⚙️ How It Works
1. **Repository scanning**: Jenkins periodically scans your Git repo.
2. **Branch detection**: New branches trigger automatic pipeline creation.
3. **Jenkinsfile execution**: Each branch runs its own pipeline defined in its Jenkinsfile.
4. **Pull request integration**: Pipelines can run automatically for PRs, enabling early bug detection.

---

## 📊 Comparison: Traditional vs. Multibranch Pipeline

| Feature              | Traditional Pipeline         | Multibranch Pipeline        |
|----------------------|------------------------------|-----------------------------|
| Job setup            | Manual per branch            | Auto-created per branch     |
| Flexibility          | One pipeline for all         | Branch-specific pipelines   |
| Maintenance          | High (duplicate configs)     | Low (self-managing)         |
| PR support           | Limited                      | Built-in                    |
| Scalability          | Harder with many branches    | Easy, branch-aware          |

---

## 🚀 Benefits
- **Automation efficiency**: Saves time by eliminating manual job creation.
- **Improved code quality**: Each branch tested independently.
- **Early bug detection**: PR pipelines catch issues before merging.
- **Environment-specific delivery**: Different outcomes for dev vs. prod branches.

---

## ⚠️ Challenges & Tips
- **Resource usage**: Many branches = many jobs; ensure Jenkins has enough capacity.
- **Jenkinsfile discipline**: Each branch must maintain a valid Jenkinsfile.
- **Access control**: Secure pipelines to prevent unauthorized builds.

---

## ✅ Key Takeaways
- Multibranch pipelines make CI/CD **scalable and branch-aware**.
- They reduce manual setup and improve **consistency across environments**.
- Best suited for teams with **multiple active branches** and frequent PRs.


## **Note** :
- Steps:
    - 1. Create a multiple pipeline job and use git repo and set trigger.
    - 2. create a jenkins file in each git repo branch each of them can thier own steps and differences.
    - 3. do not use any clone repo instead use checkout scm step only if you are using deletedir() else let it be as jenkins will run checkout on its own and then start the pipeline from jenkins file.

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
}


```