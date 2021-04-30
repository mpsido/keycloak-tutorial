# Keycloak tutorial

## Introduction

Keycloak is an open source user account and permission management server.

A "classic" application ecosystem is composed of a database, backend and frontend.

Many applications choose to manage user accounts with source code that do many things:
* create tables in the database to store user emails and password hash
* serve a /register api endpoint on the backend to create user accounts
* serve a /login api endpoint to create and sign jwt tokens
* acquire the jwt token from the frontend and use it for queries to the backend
* protect backend's api endpoints with a middleware that checks the jwt token signature and validity

This work fine, but keycloak can help doing most of that with much less coding.

Keycloak will act as a "trusted third party" in your ecosystem. Keycloak will be responsible of storing the user information, generating and checking user tokens.

In short keycloak will be your oauth provider.

Keycloak can also much more for you: for example handling the email verification process with verification link etc...

And of course everything is self hosted: you own all the user data that keycloak will collect for you.

## Tutorial

### Start keycloak server and create the application realm

Step 1: create the keycloak server user docker-compose.yml

```bash
docker-compose up
```

You can also do it with a single docker command:

```bash
docker run --rm -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin123 -it jboss/keycloak
```

Step 2: go to [localhost:8080](localhost:8080) (you may need to wait a few minutes until the server is ready to listen). Then, go the admin console.

*Remark*: user and passord are those that you specified in the environment variables you pass with the docker command (admin/admin123).

Create a "realm": a realm is a sort of namespace where the permissions are managed.

If in the future you have many websites/applications for different business, you can manage each application ecosystem in a different realm.

Remark: you could do it from the default "master" realm, but prefer reserving this one for administrator.

Hover the name of your current realm "Master" on the top left corner of keycloak console. Then click the "Add realm" button that you will see apearing.

For the rest of this tutorial I am going to call that realm: "myrealm".

### Serve a protected application

In this step we are going to serve a simple node.js application an protect some endpoints using keycloak.

First we are going to create a client application in the keycloak console.

Select your realm when go to the Clients tab (panel on the left).

Hit the "Create" button. Call your client any name but for the rest of the tutuorial we are going to assume you called it: "myclient".

As root url you can input: http://localhost:5000. This is the domain that your user will have to input in their browser url bar to access your application.

It is important that this domain is the same as the one where you are serving your application. During user authentication, keycloak will check that the "redirect url" and "origin" match this domain.

This tutorial provides a simple application listening on http://localhost:5000

You just need to install the dependencies.
```bash
cd backend-client
npm install
```

Before you start the application, have a look at index.js.

Check that the kcConfig match the json content you will see in the Installation tab of your keycloak console (top right).

