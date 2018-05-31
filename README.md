[![Build Status](https://travis-ci.org/lumenlearning/OpenAssessments.svg?branch=master)](https://travis-ci.org/lumenlearning/OpenAssessments)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/16b428851c374eb6b6d96c6d2eb7ee4a)](https://www.codacy.com/app/monkecheese/OpenAssessments?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lumenlearning/OpenAssessments&amp;utm_campaign=Badge_Grade)

# Open Assessments

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

### Possible errors

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

Assuming you are using
[AWS](https://aws.amazon.com/)
for hosting and you have everything configured correctly,
deployment is as simple as running `eb deploy` from the project root directory.

For details on setting up deployment with AWS, follow [these instructions](docs/deployment_instructions.md).
