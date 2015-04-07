var wd = require('wd');
var request = require('request');
var assert = require('chai').assert;
var config = require('./config');

var argv = exports.argv = require('minimist')(process.argv.slice(2))

// possible options
var browsers = ['firefox', 'chrome', 'opera', 'safari']
var environments = {
  'local': 'http://localhost:3000',
  'ws': 'http://webservices.healthtap.com',
  'qa2': 'https://qa2.healthtap.com',
  'labs': 'https://labs.healthtap.com',
  'prod': 'https://www.healthtap.com'
};

// default options
var browser_name = 'chrome';
var environment = 'qa2';

/* parse command line args to set options */
// -b <browser_name>
// -e <environment>
if( argv['b'] && browsers.indexOf( argv['b'] ) !== -1 ) browser_name = argv['b'];
if( argv['e'] && environments[argv['e']] ) environment =  argv['e'];

// Test all logged out pages to see if they load from simple GET request
// describe('Logged Out Static Pages Should Load < 4 Seconds', function(){
//   this.timeout(4000);

//   _.each( config.static_page_urls, function(url, index){
//     it(' GET '+url+' => 200', function( done ){
//       var path = environments[environment]+url;
//       request( path, function(err, response, body){
//         assert( response.statusCode === 200, path+' loads successfully' );
//         done();
//       });
//     });
//   });
// });

// describe('Logged Out SEO Pages Should Load < 4 Seconds', function(){
//   this.timeout(4000);
//   _.each( config.seo_page_urls, function(url, index){
//     it(' GET '+url+' => 200', function( done ){
//       var path = environments[environment]+url;
//       request( path, function(err, response, body){
//         assert( response.statusCode === 200, path+' loads successfully' );
//         done();
//       });
//     });
//   });
// });

// Setup Selenium Config
wd.configureHttp({
  timeout: 60000,
  retries: 3,
  retryDelay: 100,
  baseUrl: environments[environment]
});

var browser = exports.browser = wd.promiseChainRemote();
var p = exports.p = { promise: null };

console.log('<<<<<<<< Test Start >>>>>>>>');
console.log('browser: '+browser_name+', environment: '+ environment);

var member_name = 'member1003@gmail.com';
var member_password = 'm3mber';

var expert_name = 'mo.li+3@healthtap.com';
var expert_password = '12345678';

// Include utils ( will include app to get reference to the promise )
var util = require('./util.js');

// util.login('member1003@gmail.com', 'm3mber');

// p.promise = p.promise
//   .sleep(1000)
//   .then(function(){
//     console.log('!');
//   })
//   .sleep(1000)
//   .nodeify( function(){
//     console.log('done!!');
//   })

describe('HealthTap Tests', function(){
  this.timeout(20000);

  // Load browser with home page
  before(function( done ){

    p.promise = browser
      .init({ browserName: browser_name })
      .setAsyncScriptTimeout(30000)
      .get('/')
      .then(done);

  });

  describe('Logout', function(){

    before(function( done ){
      util.logout();
      p.promise = p.promise.then(done)
    });

    it('Should set guest flag', function( done ){

      p.promise.eval('App.defaults.user_json.person.guest', function( err, res ){
        assert( res === true, path+' guest flag set' );
        return p.promise;
      })
      .then(function(){
        done();
      });

    });

    it('Should land on home page', function( done ){

      p.promise.eval('window.location.pathname', function( err, res ){
        assert( res === '/', path+' url is home page' );
        return p.promise;
      })
      .then(function(){
        done();
      });

    });

  });

  describe('Member Login ', function(){

    before(function( done ){
      util.logout();
      util.login(member_name, member_password);
      p.promise = p.promise
      .then(function(){
        done();
      });
    });

    it('Should set member flag', function( done ){
      p.promise = p.promise.eval('App.defaults.user_json.person.member', function( err, res ){
        assert( res === true, path+' member flag set' );
        return p.promise;
      })
      .then(function(){
        done();
      });
    });
  });

  describe('Expert Login ', function(){

    before(function( done ){
      util.logout();
      util.login(expert_name, expert_password);
      p.promise = p.promise
      .then(function(){
        done();
      });
    });

    it('Should set expert flag', function( done ){
      p.promise = p.promise.eval('App.defaults.user_json.person.expert', function( err, res ){
        assert( res === true, path+' expert flag set' );
      })
      .then(function(){
        done();
      });
    });

  });

  // close the browser when done
  after(function( done ){
    p.promise = p.promise
      .quit()
      .then( done );
  });

});


// describe('Logout', function(){
//   this.timeout(4000);
//   it('Should Work', function( done ){
//     util.logout(user_name, password);
//   });
// });

// describe('Signup Pages', function(){
//   this.timeout(4000);
// });