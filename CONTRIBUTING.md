# Contributing

We look forward to seeing contribution to this product. The guidelines here represent our understanding on how to best to deliver value to production.

See: [1Team Standard Process on adding/modifying fluentbit configuration in Funbucks](https://apps.nrs.gov.bc.ca/int/confluence/pages/viewpage.action?pageId=144247169)

Document the process to work on funbucks for new server fluentbit configuration

# Pre-Requisites:

    WSL
    Git bash and GUI app
    Visual Studio Code


# Setup FUNBUCKS repo 

1. Clone funbucks : https://github.com/bcgov-nr/nr-funbucks

    Command: git clone https://github.com/bcgov-nr/nr-funbucks.git

2. branch it first

    Command: git checkout -b feat/newbranchname

3. Do the code change, commit and publish the change repo

    - Add/Modify servername.json file in https://github.com/bcgov-nr/nr-funbucks/tree/main/config/server
    For example: 

        * Proxy server type: backup.json
        * Tomcat server type: between.json 
        * Other application server type: WSO2 translate.json, refactor.json

    - Modify/Add new line for the server in https://github.com/bcgov-nr/nr-funbucks/blob/main/scripts/fluentbit_agents.csv, the list will pop in the parameter list in Jenkins deployment jobs 

    - Add fluentbit monitor job for the new server in the OpenSearch, follow the instruction on [Confluence page : create monitor via Terraform in nr-apm-stack](https://apps.nrs.gov.bc.ca/int/confluence/display/EPSILON/nr-apm-stack)

4. New pull request(PR) will appear in https://github.com/bcgov-nr/nr-funbucks/pulls

5. Wait for the PR being reviewed and approved. Merge the code change into main branch in the Github repo

6. One time action to add another remote repo from Bitbucket to Github local repo

    - Command: git remote add stash https://user.name%40gov.bc.ca@bwa.nrs.gov.bc.ca/int/stash/scm/oneteam/oneteam-nr-funbucks.git
    
    Confirm there are two remote repo links (origin and stash):

        Command: git remote -v
        origin  https://github.com/bcgov-nr/nr-funbucks.git (fetch)
        origin  https://github.com/bcgov-nr/nr-funbucks.git (push)
        stash   https://bwa.nrs.gov.bc.ca/int/stash/scm/oneteam/oneteam-nr-funbucks.git (fetch)
        stash   https://bwa.nrs.gov.bc.ca/int/stash/scm/oneteam/oneteam-nr-funbucks.git (push)

7. Sync Github repo to Bitbucket stash repo

    Command: git push stash main

# Deploy fluentbit to a new server:

    Run Jenkins job: https://apps.nrs.gov.bc.ca/int/jenkins/job/FLUENTBIT/job/fluentbit-deploy/

    Pick the server from fluentbitHost list

# Test Fluentbit configuration locally

    [Confluence page : Set up and run NR-APM-STACK and FUNBUCKS on your workstation](https://apps.nrs.gov.bc.ca/int/confluence/display/1TEAM/Set+up+and+run+NR-APM-STACK+and+FUNBUCKS+on+your+workstation)
