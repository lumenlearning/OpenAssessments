# Deployment Instructions

These instructions will help you setup local deployment to staging and production environments in AWS.

## Getting Started

The following instructions will create "project" directories for the AWS CLI commands to work in.
You will need two -- one for prod and one for staging.

### Prerequisites

* wget
* AWS CLI tools
* AWS account credentials
* AWS API access keys
* Member of the `dept-development` AWS IAM group

### 1. Install wget

`wget` is a file download tool.

Using Homebrew, install `wget`:

    $ brew install wget

### 2. Install PIP
`pip` is a package manager for Python.
It is equivalent of npm for Node.

First, download the pip installer:

    $ mkdir -p ~/aws ; cd ~/aws
    $ wget https://bootstrap.pypa.io/get-pip.py

Next, install pip system-wide:

    $ sudo python get-pip.py 

### 3. Install Virtualenv

`virtualenv` is a virtual environment manager for Python.
It is very similar to nvm for Node and rbenv for Ruby.

    $ sudo pip install virtualenv

### 4. Modify `.bash_profile`

The following aliases will make activating virtual Python environments easier.
Please add the following two lines to your `.bash_profile` file:

    alias venv='source venv/bin/activate'
    alias vaws='source ~/aws/venv/bin/activate'

The first alias will activate a Python virtual environment in the current directory.
The second alias will activate the Python virtual environment created in the next step.

### 5. Create a virtual Python environment
       
This will create a Python virtual environment to contain the AWS command line tools.

In a new terminal window:

    $ mkdir -p ~/aws; cd ~/aws
    $ virtualenv venv
    $ vaws

### 6. Install the AWS command line tools
       
These will be used to interact with the staging Beanstalk environment to do things like checking the environment status and deploying projects to staging environments.

    $ pip install awscli
    $ pip install awsebcli

Add your AWS API credentials with the following command. 
Your credentials will be provided to you by an AWS admin at Lumen Learning.

    $ aws configure

### 7. Setup AWS Credential files

You will need to place your production and staging API credentials into two separate files.

Place the following contents into `~/.aws/prod_credentials`:

	[default]
	aws_access_key_id = (your PROD access key ID goes here)
	aws_secret_access_key = (your PROD access key secret goes here)

Place the following contents into `~/.aws/staging_credentials`:

	[default]
	aws_access_key_id = (your staging access key ID goes here)
	aws_secret_access_key = (your staging access key secret goes here)
	
### 8. Create AWS Credential swap scripts
       
These scripts will allow you to easily switch between staging and production AWS credentials.

`aws-prod.sh`:

    #!/bin/bash
    
    ln -sf "${HOME}/.aws/prod_credentials" "${HOME}/.aws/credentials"
    ls -l "${HOME}/.aws/credentials"
    
    echo -e "\033[1;31m--> Using PRODUCTION credentials for AWS!\033[0m"

`aws-staging.sh`:
    
    #!/bin/bash
    
    ln -sf "${HOME}/.aws/staging_credentials" "${HOME}/.aws/credentials"
    ls -l "${HOME}/.aws/credentials"
    
    echo -e "\033[1;36m--> Using staging credentials for AWS.\033[0m"

### 9. Setup the staging "project" directory

In your terminal window:

	$ mkdir -p ~/staging/openassessments
	$ cd ~/staging/openassessments
	$ aws-staging.sh
	$ eb init

After running `eb init`, 
make sure to select the correct region and application:

	Default region = us-west-2
	Application = openassessments-stg2

To confirm your setup,
type `eb status`.
The will display the staging environment details.

### 10. Setup the production "project" directory

In your terminal window:

	$ mkdir -p ~/production/openassessments
	$ cd ~/production/openassessments
	$ aws-prod.sh
	$ eb init

After running `eb init`, 
make sure to select the correct region and application:

	Default region = us-west-2
	Application = openassessments-prod

To confirm your setup, type `eb status`. The will display the production
environment details.

## Post-setup reference

The following instructions assume you've performed all of the steps above.

### Log into staging OpenAssessments

	$ aws-staging.sh
	$ cd ~/staging/openassessments
	$ eb status
		(confirm the output displays the staging environment)
	$ eb ssh

### Log into production OpenAssessments

***NOTE**: When logged into production OpenAssessments,
you will have **FULL** administrative privileges.
It will be possible to **DESTROY** the production site! Please be **CAUTIOUS**!*

	$ aws-prod.sh
	$ cd ~/production/openassessments
	$ eb status
		(confirm the output displays the production environment)
	$ eb ssh

### Access the rails console:

Log into prod or staging, then:

	$ cd /var/app/current
	$ rails c

### View application logs:

Log into prod or staging, then:

	$ cd /var/app/current/log
	$ ls -l

