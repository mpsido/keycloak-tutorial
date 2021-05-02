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

In short keycloak will be your *oauth provider*.

Keycloak can also much more for you: for example handling:
* the user registration
* email verification process with verification link
* support third party OAuth providers
* much more...

And of course everything is **[open source](https://github.com/keycloak/keycloak)** **self hosted**: you own all the user data that keycloak will collect for you.

## Tutorial

### I. Host your keycloak server in a docker container

Create the keycloak server using docker-compose.yml

```sh
docker-compose up
```

You can also do it with a single docker command:

```sh
docker run --rm -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin123 -it jboss/keycloak
```

We put an alias for that in `setenv.sh`:
```sh
source setenv.sh
keycloak
```

### II. Create the application realm

#### Connect to your keycloak admin console

Go to [localhost:8080](localhost:8080) (you may need to wait a few minutes until the server is ready to listen). Then, go the admin console.

*Remark*: user and passord are those that you specified in the environment variables you pass with the docker command (admin/admin123).

#### Create a user realm "myrealm"

A realm is a sort of namespace where the permissions are managed.

If in the future you have many websites/applications for different business, you can manage each application ecosystem in a different realm.

*Remark*: you could do it from the default "master" realm, but prefer reserving this one for administrator.

Hover the name of your current realm "Master" on the top left corner of keycloak console. Then click the "Add realm" button that you will see apearing.

For the rest of this tutorial I am going to call that realm: "**myrealm**".

### III. Serve a protected application

#### Declare a client app in keycloak admin console

In this step we are going to serve a simple node.js application an protect some endpoints using keycloak.

First we are going to create a client application in the keycloak console.

Select your realm when go to the Clients tab (panel on the left).

Hit the "Create" button. Call your client any name but for the rest of the tutuorial we are going to assume you called it: "myclient".

As root url you can input: http://localhost:5000. This is the domain that your user will have to input in their browser url bar to access your application.

It is important that this domain is the same as the one where you are serving your application. During user authentication, keycloak will check that the "redirect url" and "origin" match this domain.

Just set: 
**Base URL**: "/"

Leave the rest of the settings at their default value for now.

#### Run your example backend

This tutorial provides a simple application listening on http://localhost:5000

You just need to install the dependencies.
```sh
cd backend-client
npm install
```

Before you start the application, have a look at `index.js`.

Check that the kcConfig match the json content you will see in the Installation tab of your keycloak console (top right).

#### Test it

Just type in your browser bar [localhost:5000](http://localhost:5000).

* If you click the [/public](http://localhost:5000/public) page: no problem *you have access*
* If you click the [/private](http://localhost:5000/private) page: *you will be redirected to keycloak's login page*


### IV. Manage application users

Now when you try to login on your [/private](http://localhost:5000/private) page: **the admin credentials won't work**.

Because the admin is on *another realm*.

#### Let's create a default user from keycloak's console

Go the [User tab](http://localhost:8080/auth/admin/master/console/#/realms/myrealm/users) on the right panel (make sure you have selected "myrealm" as current realm).

Hit "Add user" button on the to right corner.

Name it whatever you want but for the rest of the tutorial we are going to assume you named it "**myuser**".

Once the user is created go to his "credentials tab". And set his password.

* **Password**: myuser123
* **Password Confirmation**: myuser123

#### Log in a myuser

Go to your [localhost:5000/private](http://localhost:5000/private) page.