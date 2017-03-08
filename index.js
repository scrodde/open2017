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
const assetsManifest = require(path.resolve(__dirname, 'public/assets/assets-manifest.json'));
let baseUrl   = 'http://open.scrod.de';

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
    path: '/crossfitlauttasaari',
    handler: (request, reply) => {
      reply.view('index', {
        config: {
          title: 'Crossfit Lauttasaari',
          apiBaseUrl: `${baseUrl}/api`,
          affiliate: '7508',
          assets: {
            js: assetsManifest.main.js,
            css: assetsManifest.main.css,
          },
          og: {
            url: request.uri,
            title: 'Crossfit Lauttasaari Leaderboard 2017',
            description: 'Crossfit Lauttasaari Leaderboard 2017',
            image: `${baseUrl}/images/cfl_logo.jpg`,
          }
        }
      });
    }
  });
});

server.register(require('inert'), (err) => {

  if (err) { throw err; }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
          path: 'public/assets'
      }
    }
});
});

/**
 * Startup
 */
server.start((err) => {
  if (err) { throw err };
  console.log(`Server running at: ${server.info.uri}`);
  if (env == 'development') baseUrl = server.info.uri;
});
