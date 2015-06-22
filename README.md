#Open Assessments

This project provides a starting point for building a Canvas LTI or OAuth application.

##Running Canvas Starter App

###QTI
Most qti in active use seems to be the qti 1.2 lite variant. Full qti comes packaged in a zip file.

####oEmbed
See the API Documentation for the documentation on oEmbed.

####edX Support
Open Assessments supports the drag and drop and multiple choice question types from edX.
For more information on the edX xml structure see http://edx-open-learning-xml.readthedocs.org/en/latest/index.html

####Assessment by Url
Assessments can be loaded directly from a remote url - the assessment need not be loaded into http://www.openassessments.com.
Just specify a src_url. CORS must be enabled on the server specified by src_url. Example:

http://www.openassessments.com/assessments/load?confidence_levels=true&eid=atest&src_url=https%253A%252F%252Fdl.dropboxusercontent.com%252Fu%252F7594429%252FedXCourse%252Fsequential%252F97cc2d1812204294b5fcbb91a1157368.xml

####Stats
For assessments loaded into http://www.openassessments.com you simply need to browse to the assessment and click on the bar graph.
Stats are available on the site, as json and as csv. Loading stats for an assessment that was loaded via a src_url is a bit trickier.
You'll want to specify an 'eid' (external identifier). In theory you can query later on based on src_url but that makes things hard to control and a
bit unpredictable. Here's an example using our MIT edX course:

http://www.openassessments.com/assessments/load?confidence_levels=true&eid=atest&src_url=https%253A%252F%252Fdl.dropboxusercontent.com%252Fu%252F7594429%252FedXCourse%252Fsequential%252F97cc2d1812204294b5fcbb91a1157368.xml

For that assessment, the eid specified was 'atest'. View the stats by asking for them by eid. Note that the /0? is important in the url as it tells the system
that you want to find the stats by eid rather than by id:

html:
http://www.openassessments.com/assessment_results/0?eid=atest

csv:
http://www.openassessments.com/assessment_results/0.csv?eid=atest

json:
http://www.openassessments.com/assessment_results/0.json?eid=atest

We recommend using a GUID for the eid to prevent conflicts with other assessments.


##Development

To test your Canvas application with Canvas you will need to provide a public SSL url. The simpliest way to do this is to
use ngrok which can be downloaded from https://ngrok.com/.

###Foreman
Foreman makes it simple to startup all the services required to run the application in development mode. To start the application using foreman simply run:

```
$ foreman start -f Procfile.dev
```

Make sure you have the latest version of Foreman installed.

####Environment
Foreman will automatically find and read the .env file.

###Without Foreman
If you need to run services individually or just don't like Foreman you can run each service seperately:

```
$ rails server
$ cd client && nodemon webpack.hot.js
$ ngrok --subdomain master_assets --log stdout 8080
$ ngrok --subdomain canvasstarterapp --log stdout 3000
```



###File Modifications

####Change .env for Foreman
Rename `.env.example` to `.env` and configure it to your liking.

#### Modify application name
1. Open application.rb and change `CanvasStarterApp` to the name you choose.
2. Do a global search and replace for `canvas_starter_app` and change it to the name you choose. 
3. Do a global search and replace for `canvasstarterapp` (use only letters or numbers for this name. Special characters like '_' will result in errors).

#### Secrets file
Rename `config/secrets.example.yml` to `config/secrets.yml`. Open the file and change each entry to values that are relevant for your application. 

*This file should not be committed to your repository.*

You will need to [request a Canvas ID and Secret from Instructure](#developer_key). You will also
need to setup a default account and provide that account's "code" for the "application_code" entry in secrets.yml. See the [seeds](#seeds) section below for information on setting up the default account.



###Project Dependencies

####Requirements

This application requires:

-   Ruby
-   Rails
-   PostGreSQL

Learn more about [Installing Rails](http://railsapps.github.io/installing-rails.html).

####NGROK
To test your application with Canvas you will need to provide a public SSL url. The simpliest way to do this is to use ngrok which can be downloaded from [ngrok](https://ngrok.com/).

Running 'ngrok --subdomain canvasstarterapp --log stdout 3000' will create a tunnel. You will access your application using the ngrok url:

`https://canvasstarterapp.ngrok.com`

####Webpack
Packs CommonJs/AMD modules for the browser.
```
$ npm install -g webpack
$ cd client && webpack
```

####Install Javascript Libraries
To get started run:

```
$ npm install
```

#####npm-shrinkwrap
[npm-shrinkwrap](https://github.com/uber/npm-shrinkwrap) is used to lock specific versions.
npm-shrinkwrap.json is included in the project. To verify your package.json & node_modules tree are in sync run:

```
$ npm shrinkwrap
```

To find outdated modules run:

```
$ npm outdated
```

Packages must be updated manually. For example:

```
$ npm update lodash
```

After updating be sure to run shrinkwrap again:

```
$ npm shrinkwrap
```

####React
Most LTI applications need to be single page applications in order to avoid a bug that prevents cookies from being written in some
browsers. The Canvas Starter App uses React. During development run the [React Hot Loader](https://github.com/gaearon/react-hot-loader).


###<a name="seeds"></a>Setting up Database

Open db/seeds.rb and configuration a default account for development and production. Here's a summary of the values and their purpose:

- **code:** Uniquely identifies the account. This is used for the subdomain when running 
applications on a single domain.
- **domain:** Custom domain name.
- **name:** Name the account anything you'd like.
- **lti_key:** A unique key for the LTI application you are building. This will be provided to Canvas.
- **lti_secret:** The shared secret for your LTI application. This will be provided to Canvas 
and will be used to sign the LTI request. Generate this value using `rake secret`. Alternatively if you leave this field empty an LTI secret will be automatically generated for the account.
- **canvas_uri:** The URI of the Canvas institution to be associated with a specific account.


Once you've setup your seeds file run it to setup database defaults:

```
$ rake db:setup
```
or

```
$ rake db:create
$ rake db:schema:load
$ rake db:seed
```


###<a name="developer_key"></a>Request a Canvas Developer Key

Go to the [Canvas Developer Key Request Form](https://docs.google.com/forms/d/1C5vOpWHAAl-cltj2944-NM0w16AiCvKQFJae3euwwM8/viewform)
Most of the fields will be specific to your organization. The Oauth2 Redirect URI and Icon URL will be as follows below. Be sure to replace `canvasstarterapp.ngrok.com` with your domain. You will need an ID and secret for development and for production. The
development URI will use ngrok while the production URI will use your domain.

**Oauth2 Redirect URI:**
https://canvasstarterapp.ngrok.com/auth/canvas/callback

**Icon URL:**
https://canvasstarterapp.ngrok.com/oauth_icon.png 

Once your request is approved you will receive a Canvas ID and Secret. Add these credentials to the `config/secrets.yml` file under `canvas_id` and `canvas_secret`.


##Deployment

###Elasticbeanstalk
Ensure that
`bin/bootstrap`
was run initially to setup the correct symlinks

Run
`bin/deploy`
to deploy

###Heroku

Make sure you have signed up for a heroku account [Heroku](http://www.heroku.com). Then follow the instructions provided by Heroku to create your application.

Push secrets to production:
```
$ rake heroku:secrets RAILS_ENV=production
```

Deploy to Heroku:
```
$ git push heroku master
```

###Other Services

By default `config/unicorn.rb` is setup to deploy to Heroku. Open that file, comment out the Heroku section and uncomment the other configuration to setup unicorn for deployment to another service like AWS.

Here are my notes on how to add libraries, that are required by the ruby saml mod gem, to Heroku.

The ruby saml gem uses the xmlsec and xmlsec-openssl shared libraries. It appears that these libraries are not installed on the Heroku cedar platform.

Heroku cedar is based on ubuntu 10.04 64-bit. So binary dependencies that are compatible with Heroku can be found on packages.ubuntu.com. Find and download the deb package, and unpack it. ruby-saml-mod depends on libraries that can be found in two debian packages:

    libxmlsec1_1.2.9-5ubuntu5_amd64.deb
    libxmlsec1-openssl_1.2.9-5ubuntu5_amd64.deb

If you are on a Mac you can unpack a deb package using the ar utility.

ar -x libxmlsec1-openssl_1.2.9-5ubuntu5_amd64.deb

The library files are:

    libxmlsec1.so.1.2.9
    libxmlsec1-openssl.so.1.2.9

The files that you need in the directory where the libraries are stored:

    libxmlsec1-openssl.so -> libxmlsec1-openssl.so.1.2.9
    libxmlsec1-openssl.so.1 -> libxmlsec1-openssl.so.1.2.9
    libxmlsec1-openssl.so.1.2.9
    libxmlsec1.so -> libxmlsec1.so.1.2.9
    libxmlsec1.so.1 -> libxmlsec1.so.1.2.9
    libxmlsec1.so.1.2.9

The other files are symlinks to the real libraries. They are required and need to be checked into the repo. Use ls -l in the directory where the libraries and symlinks live to ensure that the symlinks are relative paths.

An alternative to committing the files to the repository is to use build packs. If you decide to go the buildpack route, you will probably have to use the multi buildpack.

When Heroku precompiles assets it uses a different environment than for running the application. So the build will fail, because the saml gem cannot find its library dependencies, even if the runtime environment is configured correctly. One way to work around this situation is to move the require statements for the saml gem into the controller class methods where the gem is used. This way the require is not called during the build step. Another possiblity is to use a Heroku labs feature to use the runtime environment variables for the build environment.

For the gem to know where to find the library, you need to set the LD_LIBRARY_PATH var to the absolute path to the folder with your libs. On Heroku an app lives in the /app directory. So, if your libraries are in the vendor/libs directory in your repository, set LD_LIBRARY_PATH to /app/vendor/libs.

The saml gem requires the following config variables(listed with an example value):

  entity_id:                      http://serviceprovider.example.com/saml
  idp_cert_fingerprint:           ae:io:uy:ae:io:uy
  idp_sso_target_url:             https://idp.example.com/idp/
  issuer:                         serviceprovider.example.com
  name_identifier_format:         urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
  saml_certificate:               /path/to/serviceprovider.example.com.crt
  saml_private_key:               /path/to/serviceprovider.example.com.key
  support_email:                  example@serviceprovider.example.com.com
  tech_contact_email:             example@serviceprovider.example.com.com
  tech_contact_name:              Administrator


These should be set as Heroku config environment vars and then referenced when creating the ruby-saml-mod settings object.

    saml_settings = Onelogin::Saml::Settings.new
    saml_settings.issuer = ENV["issuer"]


The saml gem requires an ssl cert and key for use in the application. I made it available to the application and keep it from being committed and pushed to the public main repo by using a script that copies the keys, commits, pushes to Heroku, and finally rolls back the commit after the deploy.



###Other Services

By default `config/unicorn.rb` is setup to deploy to Heroku. Open that file, comment out the Heroku section
and uncomment the other configuration to setup unicorn for deployment to another service like AWS.

##Requirements
##Database

This application uses PostgreSQL with ActiveRecord.

##Tests

To run the client tests you will need to install Karma:

`npm install -g karma-cli`

You may need to install chromedriver if you haven't already.

```
$ brew install chromedriver
```

To run tests:

```
$ rake spec
```
