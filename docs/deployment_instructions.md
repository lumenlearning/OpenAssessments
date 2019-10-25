# Deployment Instructions

These instructions will help you setup local deployment to staging and production environments in AWS.

## Getting Started

If you have previously deployed to staging or production and just need a refresher, you can skip down to [the deploy instructions](#deploying). If this is your first go, there's a bit of set up and permissions to get sorted.

### Credentials

Deployment is done via the command line, so you must have the AWS CLI tools and [envchain](https://github.com/sorah/envchain) installed. If not, you can install both via Homebrew:

`brew install aws-elasticbeanstalk`

`brew install envchain`

Log into the AWS Console in your browser and, under "My Account" or the menu under your username, choose "My security credentials" then choose "Create access key." You will need both the access key ID and the secret to deploy.

**NOTE:** If you do not have access to AWS, get in touch with Isaac.

Back on the command line, you'll want to commit the AWS access key ID and and secret to your keychain. To do this, run the following command:

`envchain -s aws-stage AWS_ACCESS_KEY_ID`

and then enter the access key ID. Then run

`envchain -s aws-stage AWS_SECRET_ACCESS_KEY`

and enter your secret.

You will need to repeat this process for production (including creating a new access key), replacing `aws-stage` with `aws-prod`:

Now your AWS credentials have been saved to your macOS Keychain. 🙌🏻

You will need to prefix any AWS `eb` commands with `envchain aws-stage` to use these credentials.

### AWS Settings
You now want to set some default values for this application via `eb init`.

#### Staging

On the command line, run

`envchain aws-stage eb init`

This will result in a series of questions; the proper config settings are as follows:

1. Default region = 3 (us-west-2/US West Oregon)
2. Application = openassessments-stg2
3. CodeCommit = n (default)

After you've finished the config, you can verify it by running `envchain aws-stage eb status`.

#### Production

As above, but replace `aws-stage` with `aws-prod` and set the application to be `openassessments-prod`. Detailed instructions follow.

On the command line, run

`envchain aws-prod eb init`

This will result in a series of questions; the proper config settings are as follows:

1. Default region = 3 (us-west-2/US West Oregon)
2. Application = openassessments-prod
3. CodeCommit = n (default)

After you've finished the config, you can verify it by running `envchain aws-prod eb status`.

## Deploying

1. If deploying to production, make an announcement in the `#product-announcements` Slack channel.
1. On the command line, navigate to the `openassessments` directory and verify that you have checked out the branch you intend to deploy (e.g., `develop` for staging).
1. Make sure you have the latest code from GitHub by running `git fetch` and `git pull`.
1. Compile the application assets via `nvm use 0.10.37 && bundle exec rake assets:clobber && bundle exec rake assets:precompile && bundle exec rake assets:webpack`
1. Run the command for deploying to the
	- staging server: `envchain aws-stage eb deploy`
	- production: `envchain aws-prod eb deploy`
1. Watch the terminal and AWS Console as the archive is created and the deploy runs.
1. If you deployed to production, announce the successful deployment in the `#product-announcements` Slach channel.

## Logging into the AWS servers
The following instructions assume you've performed all of the steps under [Getting Started](#getting-started).

### Staging
```
	$ envchain aws-stage eb status
		(confirm the output displays the staging environment)
	$ envchain aws-stage eb ssh
```

### Production

***NOTE**: When logged into production OpenAssessments,
you will have **FULL** administrative privileges.
It will be possible to **DESTROY** the production site! Please be **CAUTIOUS**!*
```
	$ envchain aws-prod eb status
		(confirm the output displays the production environment)
	$ envchain aws-prod eb ssh
```

### Access the rails console

Using the instructions above, log into prod or staging, then:
```
	$ cd /var/app/current
	$ rails c
```
### View application logs:

Using the instructions above, log into prod or staging, then:
```
	$ cd /var/app/current/log
	$ ls -l
```
