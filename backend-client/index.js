const express = require("express");
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();

const kcConfig = {
  "realm": "myrealm",
  "auth-server-url": "http://localhost:8080/auth/",
  "ssl-required": "external",
  "resource": "myclient",
  "public-client": true,
  "confidential-port": 0
};

const keycloak = new Keycloak({ store: memoryStore, idpHint: 'http://localhost:8080/auth/realms/myrealm/account/' }, kcConfig);

const app = express();

app.use(session({
  secret: '5dd9de66-ec05-470a-b46d-98803f2daa9e',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.get( '/private', keycloak.protect(), (req, res, next) => {
    console.log('privateHandler');
    res.send('private');
    next(req, res);
});

app.get( '/public', (req, res, next) => {
    console.log('publicHandler');
    res.send('public');
    next(req, res);
});

app.listen(process.env.PORT || 5000);
