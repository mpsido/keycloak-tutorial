const express = require("express");
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const fs = require('fs');

const memoryStore = new session.MemoryStore();

const kcConfig = {
  "realm": "myrealm",
  "auth-server-url": "http://localhost:8080/auth/",
  "ssl-required": "external",
  "resource": "web-auth-backend",
  "credentials": {
    "secret": "6d6d616f-016f-460a-9a40-9348dd3eac5b"
  },
  "confidential-port": 0
};

const keycloak = new Keycloak({ store: memoryStore, idpHint: 'http://localhost:8080/auth/realms/myrealm/account/' }, kcConfig);

const app = express();

app.use(session({
  secret: 'some-random-secret-that-has-nothing-to-do-with-keycloak',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Very important:
// the middleware is in charge of exchanging the authentication code for an authentication token and set it in the cookies
app.use(keycloak.middleware());

// Not necessary because "By default, the middleware catches calls to /logout"
// See documentation here: https://www.keycloak.org/docs/latest/securing_apps/index.html#additional-urls
// app.use( keycloak.middleware( { logout: '/logout' } ));

app.get('/', (req, res, next) => {
  try {
    fs.readFile('./index.html', function (err, html) {
      if (err) {
        res.status(500);
        res.send(err);
        return;
      }
      res.writeHeader(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  }
  catch (err) {
    res.status(500);
    res.send(err);
  };
});

app.get( '/private', keycloak.protect(), (req, res, next) => {
    console.log('privateHandler Bearer token:\n', req.kauth.grant.access_token.token);
    try {
      fs.readFile('./private.html', function (err, html) {
        if (err) {
          res.status(500);
          res.send(err);
          return;
        }
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
      });
    }
    catch (err) {
      res.status(500);
      res.send(err);
    };
});

app.get( '/public', (req, res, next) => {
    console.log('publicHandler');
    res.send('public');
});

app.listen(process.env.PORT || 5000);
