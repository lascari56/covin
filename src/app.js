const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const AWS = require('aws-sdk');
const Store = require('s3-blob-store');
const BlobService = require('feathers-blob');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const mongoose = require('./mongoose');

const app = express(feathers());

const s3 = new AWS.S3({
  region: 'ams3',
  endpoint: 'https://ams3.digitaloceanspaces.com',
  accessKeyId: 'FIVVXMS363NGP3CS4X67',
  secretAccessKey: 'XATO3zBr/uJnYp65BzllKolmcV3Gyh5ofVmpDbm4ylg',
  // ACL: 'public-read-write'
});

// let spaces = await s3.listBuckets();

// console.log("spaces", spaces);

const blobStore = Store({
  client: s3,
  bucket: 'unocreative',
  acl: 'public-read',
  key: "covin"
});

const blobService = BlobService({
  Model: blobStore,
  // ACL: 'public-read-write'
});

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));
app.use('/upload', blobService);

// app.service('upload').before({
//   create(hook) {
//     hook.params.s3 = { ACL: 'public-read' }; // makes uploaded files public
//   }
// });

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
