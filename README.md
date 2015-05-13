#Canvas Starter App

This project provides a starting point for building a Canvas LTI or OAuth application. 

##Usage

To test your Canvas application with Canvas you will need to provide a public SSL url. The simpliest way to do this is to
use ngrok which can be downloaded from https://ngrok.com/.

### Modify application name
Change the name of the application to a name that you prefer. Open application.rb and change CanvasStarterApp to the 
name you choose. Do a global search and replace for canvas_starter_app and change it to the name you choose. Do a global
search and replace for canvasstarterapp.

### Secrets file
Rename config/secrets.example.yml to config.secrets.yml. Open the file and change each entry to values that are 
relevant for your application. You will need to request a Canvas ID and Secret from Instructure. You will also
need to setup a default account and provide that account's "code" for the "application_code" entry in
secrets.yml. See the [seeds](Seeds) section below for information on setting up the default account.

config/secrets.yml will be used to hold values that should be kept safe and which should not be commited to your repository.

`cd config`

`mv secrets.example.yml secrets.yml`

###Single Page Application Support
Most LTI applications need to be single page applications in order to avoid a bug that prevents cookies from being written in some
browsers. The Canvas Starter App uses React. During development run the (React Hot Loader)[https://github.com/gaearon/react-hot-loader]

####Webpack Integration

  `npm install -g webpack`

  `cd client && webpack`

####Install Javascript Libraries
To get started run:

  `npm install`

(npm-shrinkwrap)[https://github.com/uber/npm-shrinkwrap] is used to lock specific versions.
npm-shrinkwrap.json is included in the project. To verify your package.json & node_modules tree are in sync run:
  
  `npm-shrinkwrap`

To find outdated modules run:
  
  `npm outdated`

Packages must be updated manually. For example:

  `npm update lodash`

After updating be sure to run shrinkwrap again:

  `npm-shrinkwrap`

###ngrok

Install [https://ngrok.com/](ngrok)

__Create a local tunnel__

`ngrok --subdomain canvasstarterapp 3000`

Change `canvasstarterapp` to be the name of your application. Only use letters or numbers in the name. 
Special characters like '_' will result in errors.

Once you have created the tunnel you will access your application using the ngrok url:

`https://canvasstarterapp.ngrok.com`

###Seeds

Open db/seeds.rb and configuration a default account for development and production. Here's a summary
of the values and their purpose:
-  code         Uniquely identifies the account. This is used for the subdomain when running applications on 
                a single domain. Create a default account in the seeds.rb file and then open up `config/secrets`.yml
                and be sure to provide the code from the default account for the `application_code`. Only use letters
                and numbers in the code. Special characters will result in errors.
-  domain       Custom domain name
-  name         Name the account anything you'd like
-  lti_key      A unique key for the LTI application you are building. This will be provided to Canvas
-  lti_secret   The shared secret for your LTI application. This will be provided to Canvas and will be
                used to sign the LTI request. Generate this value using `rake secret`. Alternatively if you 
                leave this field empty an LTI secret will be automatically generated for the account.
-  canvas_uri   The URI of the Canvas institution to be associated with a specific account.

Once you've setup your seeds file run it to setup database defaults:

`rake db:seed`

###Request a Canvas Developer Key

Go to the [https://docs.google.com/forms/d/1C5vOpWHAAl-cltj2944-NM0w16AiCvKQFJae3euwwM8/viewform](Canvas Developer Key Request Form)
Most of the fields will be specific to your organization. The Oauth2 Redirect URI and Icon URL will be as follows below. Be
sure to replace `canvasstarterapp.ngrok.com` with your domain. You will need an ID and secret for development and for production. The
development URI will use ngrok while the production URI will use your domain.

__Oauth2 Redirect URI:__
https://canvasstarterapp.ngrok.com/auth/canvas/callback

__Icon URL:__
https://canvasstarterapp.ngrok.com/oauth_icon.png 

Once your request is approved you will receive a Canvas ID and Secret.
and then add the ID and Secret into the file using these fields:
canvas_id: 
canvas_secret: 

##Deployment

###Heroku

Make sure you have signed up for a heroku account [Heroku](http://www.heroku.com). Then follow the instructions provided by 
Heroku to create your application.

Push secrets to production:
`rake heroku:secrets RAILS_ENV=production`

Deploy to Heroku:
`git push heroku master`

###Other Services

By default `config/unicorn.rb` is setup to deploy to Heroku. Open that file, comment out the Heroku section
and uncomment the other configuration to setup unicorn for deployment to another service like AWS.

##Examples

Atomic Jolt has built a number of applications based on this source.

###Demo Arigato

This project was created for the Sales team at Instructure. It makes it simple to populate a sample Canvas course using values from Google Drive Spreadsheets.

Source Code: [https://github.com/atomicjolt/canvas_starter_app](https://github.com/atomicjolt/canvas_starter_app)


##Requirements

This application requires:

-   Ruby
-   Rails
-   PostGreSQL

Learn more about [Installing Rails](http://railsapps.github.io/installing-rails.html).

###Database

This application uses PostgreSQL with ActiveRecord.

###Tests

You may need to install chromedriver if you haven't already.

'brew install chromedriver'

To run tests:

'rake spec'


