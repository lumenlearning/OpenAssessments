# Open Assessments

[![Build Status](https://travis-ci.org/lumenlearning/OpenAssessments.svg?branch=master)](https://travis-ci.org/lumenlearning/OpenAssessments)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/16b428851c374eb6b6d96c6d2eb7ee4a)](https://www.codacy.com/app/monkecheese/OpenAssessments?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lumenlearning/OpenAssessments&amp;utm_campaign=Badge_Grade)


Open Embeddable Assessments (OA or OEA) is an open-source assessment-authoring engine.

## Code of Conduct

Lumen Learning's [Code of Conduct](https://github.com/lumenlearning/code_of_conduct)
is one of the ways we put our values into practice.
Our commitment to the standards outlined in the Code of Conduct help us build great teams,
craft great code,
and maintain a safe,
pleasant work environment.

## Getting Started

This application is comprised of a Ruby on Rails API and a JavaScript frontend stack.
These instructions will get you up and running on your local machine for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

### Prerequisites

These instructions assume you are using
[rbenv](https://github.com/rbenv/rbenv)
and
[nvm](https://github.com/creationix/nvm)
for Ruby and Node version management, respectively.

* Ruby (v2.2.2)
* Rails
* Bundler
* Node (v0.10.37)
* Postgresql (v9.6.3 or higher)

*For more details,
please see the `Gemfile` and `package.json` file.*

### 1. Clone the Repo

Run the following commands to clone the repository to your local machine:

  ```
  $ git clone https://github.com/lumenlearning/OpenAssessments.git
  $ cd OpenAssessments
  ```

### 2. Install Ruby Dependencies

On the command line,
install the ruby dependencies with `bundler`:

  ```
  $ bundle install
  ```

If you get this error on MacOS:
```An error occurred while installing nokogiri (1.6.6.2), and Bundler cannot continue.
   Make sure that `gem install nokogiri -v '1.6.6.2' --source 'https://rubygems.org/'` succeeds before bundling.

```

try this to get nokogiri to install
```
gem install nokogiri -v '1.6.6.2' -- --use-system-libraries=true --with-xml2-include="$(xcrun --show-sdk-path)"/usr/include/libxml2
```

If you get an error stating that the `eventmachine` gem did not install, try:

  ```
  $ gem install eventmachine -v 1.0.5 -- --with-cppflags=-I/usr/local/opt/openssl/include
  $ bundle install
  ```

### 3. Setup the Database

Before we set up all the tables in the database,
the Rails code depends on a few configuration files,
you can pull in the default configuration values by running the following command:

  ```
  $ for config in secrets database; do cp -v config/$config.yml.example config/$config.yml; done
  ```

Now,
edit the `config/secrets.yml` file and replace the pieces specified with values generated by:

  ```
  $ bundle exec rake secret
  ```

Lets setup our database configuration:

  ```
  $ createdb openassessments_development
  $ createdb openassessments_test
  ```

We can populate the database by running the following commands:

  ```
  $ APP_SUBDOMAIN=localhost bundle exec rake db:migrate
  $ APP_SUBDOMAIN=localhost bundle exec rake db:seed
  ```

Additionally,
we can run a separate rake task to populate the database with several assessments to test against:

  ```
  $ bundle exec rake generate:quizzes:all
  ```

### 4. Install JavaScript Dependencies

Make sure to have the correct version of Node running.

```
$ nvm use 0.10.37
```

If this command fails because it isn't installed,
install it.

```
$ nvm install 0.10.37
```

Now,
install the JavaScript dependencies.

```
$ cd client
$ npm install
```

You may also need to install these 4 dependencies after running the initial `npm install` for reasons yet unknown:

```
$ npm install es6-promise@3.0.2
$ npm install reactable@0.10.2
$ npm install moment@2.10.6
$ npm install react-tinymce@0.2.3
```


### 5. Start the server and React "hot reloading"

In another terminal window,
fire up React Hot Loader in `openassessments/client/`:

  ```
  $ cd client/
  $ node webpack.hot.js
  ```

Then,
in another terminal window,
run the rails server in `openassessments/`:

  ```
  $ cd OpenAssessments
  $ bundle exec rails s -p 3001
  ```

Navigate to `localhost:3001` in a browser window,
and you should be good to go.

### 6. Create a User

Hop into a rails console and generate a user.

  ```
  $ bundle exec rails c
  > u = User.new
  > u.email = "admin@example.com"  # Add your own email address here
  > u.password = "password"
  > u.password_confirmation = u.password
  > u.save!
  ```

Now,
we need to confirm the user.

  ```
  > u.confirmed_at = Time.now
  > u.save!
  ```

### 7. Associate User with Account

Next,
we want to associate that user with an account.

  ```
  > u.account_id = 1
  > u.save!
  ```

### 8. Set LTI Key and Secret on the Account

In order to do LTI launches,
we need to set the LTI key and secret on the account.
For local development,
it can be something simple.

  ```
  > a = Account.first
  > a.lti_key = "fake"
  > a.lti_secret = "fake"
  > a.save!
  ```

### 9. Remove public restriction on Account

Things are almost working at this point,
but in order to see the assessment results for some quiz types,
you have to remove the public restriction setting on the Account to false:

  ```
  > a.restrict_public = false
  > a.save!
  ```

### 10. Generate Assessments

Finally,
Lets generate some assessments.
Hop out of the rails console and run the following command:

  ```
  $ bundle exec rake generate:quizzes:all
  ```

The output generated should be a list of assessments and their associated IDs.

You should now be able to do an LTI launch to an assessment.

### Possible errors

### node-pre-gyp ERR! This is a bug in node-pre-gyp

If you get this error while installing frontend dependencies,
you might be missing XCode.
Try installing that from the App Store.

If this doesn't solve the problem,
try install `node-gyp` and `node-pre-gyp` globally:

```bash
npm install -g node-gyp node-pre-gyp
```

#### undefined method "restrict_signup' for nil:NilClass"

If this error is encountered when loading the application in a web browser,
you will need to modify a value in the database.

  ```
  $ cd openassessments/
  $ rails c
  irb(main):002:0> a = Account.first
  irb(main):003:0> a.domain = 'localhost'
  irb(main):004:0> a.save
  ```

## Running Tests

On the Ruby side,
we use
[Rspec](https://github.com/rspec/rspec)
for unit testing.
To run unit tests against the Ruby code,
run `bundle exec rake spec` from the project root directory.

On the JavaScript side,
we use
[Jasmine](https://github.com/jasmine/jasmine)
and
[Karma](https://github.com/karma-runner/karma)
for running browser tests.
To run tests against the JavaScript code,
run `npm run test` from the `client/` directory in this project.

You may need to install `chromedriver` if you haven't already.

```
$ brew install chromedriver
```

## Deployment

Compile the frontend assets by running:

  ```
  $ RAILS_ENV=production bundle exec rake assets:precompile
  $ RAILS_ENV=production bundle exec rake assets:webpack
  ```

Then,
assuming you are using
[AWS](https://aws.amazon.com/)
for hosting and you have everything configured correctly,
deployment is as simple as running `eb deploy` from the project root directory.

For details on setting up deployment with AWS, follow [these instructions](docs/deployment_instructions.md).

## Features in A/B Testing

There are a couple of new features that are being A/B tested based on the user
ID's last digit.
The features are colloquially called "Practice Feedback" and "Wait/Wait".

To find everywhere that A/B testing is occurring,
search the project for "A/B Testing" and you'll find function-level comments
like follows:

```
/**
 * A/B Testing (Quiz Tip "Pre-Attempt")
 *
 * Casing off of last digit of the User Id to determine what verbiage to use in
 * the body of the quiz tip.
 *
 * 0, 1 - No quiz tip, no modal
 * 2, 3 - No quiz tip, yes modal
 * 4    - v1 quiz tip, no modal
 * 5    - v1 quiz tip, yes modal
 * 6    - v2 quiz tip, no modal
 * 7    - v2 quiz tip, yes modal
 * 8    - v3 quiz tip, no modal
 * 9    - v3 quiz tip, yes modal
 */
 ```

This serves to illustrate when a user will see and not see these new features.
