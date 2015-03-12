#Canvas Starter App

This project provides a starting point for building a Canvas LTI or OAuth application. 

##Examples

Atomic Jolt has built a number of applications based on this source.

###Demo Arigato

This project was created for the Sales team at Instructure. It makes it simple to populate a sample Canvas course using values from Google Drive Spreadsheets.

Live Application: [http://demoarigato.herokuapp.com/](http://demoarigato.herokuapp.com/)

Source Code: [https://github.com/atomicjolt/demo_arigato](https://github.com/atomicjolt/demo_arigato)


##Usage

To test your Canvas application with Canvas you will need to provide a public SSL url. The simpliest way to do this is to
use ngrok which can be downloaded from https://ngrok.com/.

### Secrets file
config/secrets.yml will be used to hold values that should be kept safe and which should not be commited to your repository.

`cd config`

`mv secrets.example.yml secrets.yml`

###ngrok

Install [https://ngrok.com/](ngrok)

__Create a local tunnel__

`ngrok --subdomain canvasstarterapp 3000`

Change `canvasstarterapp` to be the name of your application. Only use letters or numbers in the name. 
Special characters like '_' will result in errors.

Once you have created the tunnel you will access your application using the ngrok url:

`https://canvasstarterapp.ngrok.com`

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

##Requirements

This application requires:

-   Ruby
-   Rails
-   PostGreSQL

Learn more about [Installing Rails](http://railsapps.github.io/installing-rails.html).

##Database

This application uses PostgreSQL with ActiveRecord.


