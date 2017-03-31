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
    const file = fs.readFileSync(path.join(__dirname, 'archive', `2017-affiliate-${request.params.id}.json`), 'utf-8');
    reply(JSON.parse(file));
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
            url: `${baseUrl}/crossfitlauttasaari`,
            title: 'The Open 2017 Leaderboard - Crossfit Lauttasaari',
            description: 'Crossfit Lauttasaari Open 2017 leaderboard',
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
