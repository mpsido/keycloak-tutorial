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

Step 2: go to [localhost:8080](localhost:8080) (you may need to wait a few minutes). Then, go the admin console.

Create a "realm": a realm is a sort of namespace where the permissions are managed.

If in the future you have many websites/applications for different business, you can manage each application ecosystem in a different realm.

Remark: you could do it from the default "master" realm, but prefer reserving this one for administrator.

Hover the name of your current realm "Master" on the top left corner of keycloak console. Then click the "Add realm" button that you will see apearing.

For the rest of this tutorial I am going to call that realm: "myrealm".
