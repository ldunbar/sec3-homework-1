/*
 *
 *  Section 3 - Homework assignment #1
 *  Implement a simple "Hello World" app using a RESTful JSON API.
 *
 *  The app listens on a port defined in the config.js file and will return a
 *  status code of 200 and a JSONified string when the route "/hello" is used.
 * 
 *  If a query string is added to the /hello route in the form of:
 *     ?name=userName
 *  where username is the actual user's name, then it will be used as part of
 *  the returned JSON string; otherwise, the name "friend" is used.
 * 
 *  Author: L. Dunbar
 *  Date: 11/04/2018
 * 
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// Instantiate the HTTP server.
var httpServer = http.createServer(function(req, res) {
  unifiedServer(req, res);
});

// Start the HTTP server.
httpServer.listen(config.httpPort, function() {
  console.log('The HTTP server is listening on ' + config.httpPort);
});

// Instantiate the HTTPS server.
var httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
  unifiedServer(req, res);
});

// Start the HTTPS server.
httpsServer.listen(config.httpsPort, function() {
  console.log('The HTTPS server is listening on ' + config.httpsPort);
});

// Server logic for both http and https server.
var unifiedServer = function(req,res) {

  // Get the URL and parse it.
  var parsedURL = url.parse(req.url, true);

  // Get the path to know how to route the request.
  var path = parsedURL.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get the query string as an object.
  var queryStringObject = parsedURL.query;

  // Get the headers as an object.
  var headers = req.headers;

  // Get the payoad, if any. A paylod is not expected, so it is ignored.
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });

  req.on('end', function() {
    buffer += decoder.end();

    // Choose the handler this request should go to. If one is not found, then
    // use the not found handler.
    var choseHandler = typeof(router[trimmedPath]) != 'undefined' 
      ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler.
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request to the handler specified in the router.
    choseHandler(data, function(statusCode, payload) {

      // Use the status code called back by the handler, or default of 200.
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Conver to payload to string.
      var payloadString = JSON.stringify(payload);

      // Return the response.
      res.setHeader('Content-type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });  
};

// Define the handlers.
var handlers = {};

// Hello handler: return a 200 status code and a welcome message.
handlers.hello = function(data, callback) {

  // Define the returned payload.
  var payload = {
    name : '',
    welcomeMessage : ''
  };

  // Extract the user name from the query string. If not present, 
  // use "friend".
  var userName = typeof(data.queryStringObject.name) == 'string' 
    ? data.queryStringObject.name : 'friend';
  if (userName == '') userName = 'friend';

  // Build payload response.
  payload.name = 'Hello ' + userName;
  payload.welcomeMessage = 'Thank you for using my homework assignment';
  callback(200, payload);
};

// Not found handler: return a 404 status code and empty payload.
handlers.notFound = function(data, callback) {
  callback(404, {});
};

// Define a request router.
var router = {
  'hello' : handlers.hello,
  'not found' : handlers.notFound
}
