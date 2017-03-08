const _               = require('lodash');
const fs              = require('fs');
const Hapi            = require('hapi');
const parseArgs       = require('minimist');
const path            = require('path');
const yaml            = require('js-yaml');
const rp              = require('request-promise');
const cors            = require('hapi-cors-headers');

/**
 * Configuration
 */
const argv    = parseArgs(process.argv.slice(2));
const port    = process.env.PORT || 8000;
const host    = process.env.HOST || '0.0.0.0';
const env     = process.env.NODE_ENV || 'development';

const server = new Hapi.Server();
server.connection({
  host: host,
  port: port,
});

/**
 * EXTENSIONS
 */
server.ext('onPreResponse', cors);


/**
 * Routes
 */
server.route({
  method: 'GET',
  path: '/api/affiliate/{id}',
  handler: function (request, reply) {
    rp(`https://games.crossfit.com/competitions/api/v1/competitions/open/2017/leaderboards?affiliate=${request.params.id}&page=1`)
    .then((body) => {
      json = JSON.parse(body);
      reply(json);
    })
    .catch((err) => {
      throw err;
    });
  }
});

server.register(require('vision'), (err) => {
  if (err) { throw err; }

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.view('index');
    }
  });
});

/**
 * Startup
 */
server.start((err) => {
  if (err) { throw err };
  console.log(`Server running at: ${server.info.uri}`);
});
