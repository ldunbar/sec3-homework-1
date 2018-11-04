/*
 *
 *  Create and export configuration variables.
 *
 *  Ports to be 
 */

// Define a container for the environments.
var environments = {};

// Default (testing) environment
environments.testing = {
  'httpPort'  : 3000,
  'httpsPort' : 3001,
  'envName'   : 'testing'
};

// Production environment
environments.production = {
  'httpPort'  : 5000,
  'httpsPort' : 5001,
  'envName'   : 'production'
};

// Determine which enviroment was passed as a command line param.
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' 
  ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of those above. 
// If not, default to staging.
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' 
  ? environments[currentEnvironment] : environments.testing;

// Export the module.
module.exports = environmentToExport;
