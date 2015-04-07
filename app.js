var wd = require('wd');
var _ = require('lodash');
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

// Setup Selenium Config
wd.configureHttp({
  timeout: 60000,
  retries: 3,
  retryDelay: 100,
  baseUrl: environments[environment]
});

// wd.configureHttp({
//   timeout: 60000,
//   retries: 3,
//   retryDelay: 100,
//   baseUrl: 'https://qa2.healthtap.com'
// });

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

describe('Check if Logged Out Pages Load', function(){

  describe('Static Pages Should Load < 5 Seconds', function(){
    this.timeout(5000);

    _.each( config.static_page_urls, function(url, index){
      it(' GET '+url+' => 200', function( done ){
        var path = environments[environment]+url;
        request( path, function(err, response, body){
          assert( response.statusCode === 200, path+' loads successfully' );
          done();
        });
      });
    });
  });

  describe('SEO Pages Should Load < 5 Seconds', function(){
    this.timeout(4000);
    _.each( config.seo_page_urls, function(url, index){
      it(' GET '+url+' => 200', function( done ){
        var path = environments[environment]+url;
        request( path, function(err, response, body){
          assert( response.statusCode === 200, path+' loads successfully' );
          done();
        });
      });
    });
  });

});


describe('HealthTap Selenium Tests', function(){
  this.timeout(15000);

  // Load browser with home page
  before(function( done ){

    p.promise = browser
      .init({ browserName: browser_name })
      .setAsyncScriptTimeout(30000)
      .get('/')
      .then(done.bind(null, null));

  });

  describe('Logout', function(){

    before(function( done ){
      util.logout();
      p.promise = p.promise.then( done.bind(null, null) )
    });

    it('Should set guest flag', function( done ){

      p.promise.eval('App.defaults.user_json.person.guest', function( err, res ){
        assert( res === true, path+' guest flag set' );
        return p.promise;
      })
      .then( done.bind(null, null) );

    });

    it('Should land on home page', function( done ){

      p.promise.eval('window.location.pathname', function( err, res ){
        assert( res === '/', path+' url is home page' );
        return p.promise;
      })
      .then( done.bind(null, null) );

    });

  });

  describe('Member Login ', function(){

    before(function( done ){
      util.logout();
      util.login(member_name, member_password);
      p.promise = p.promise.then( done.bind(null, null) );
    });

    it('Should set member flag', function( done ){
      p.promise = p.promise.eval('App.defaults.user_json.person.member', function( err, res ){
        assert( res === true, path+' member flag set' );
        return p.promise;
      })
      .then( done.bind(null, null) );
    });
  });

  describe('Expert Login ', function(){

    before(function( done ){
      util.logout();
      util.login(expert_name, expert_password);
      p.promise = p.promise.then( done.bind(null, null) );
    });

    it('Should set expert flag', function( done ){
      p.promise = p.promise.eval('App.defaults.user_json.person.expert', function( err, res ){
        assert( res === true, path+' expert flag set' );
        return p.promise;
      })
      .then( done.bind(null, null) );
    });

  });

  describe('Sign Up ', function(){

    function testError( url, $email, $password, $submit, $error ){

      return function( done ){
        p.promise = p.promise.get( url );

        util.execute_signup( $email, $password, $submit, {
          email: 'member1003@gmail.com',
          password: 'wrong_password'
        })

        p.promise = p.promise
        .sleep(2000)
        .elementByCssOrNull( $error, function(err, el){
          assert( !!el, ' error found ');
        })
        .isDisplayed(function( err, res ){
           assert( res === true, ' error is visible ');
        })
        .then( done.bind(null, null) );
      }

    }

    // todo
    // function testSuccess( $email, $password ){
    // }

    beforeEach(function( done ){
      util.logout();
      p.promise = p.promise.then( done.bind(null, null) );
    });

    describe('v1', function(){

      it('Should show error message on error',
        testError('/sign_up?v=1', '.email-input', '.password-input', '.btn.primary', '.signup-form .error' ) );

      it('Should go to nux on success', function( done ){
        p.promise = p.promise.get('/sign_up?v=1');

        util.execute_signup('.email-input', '.password-input', '.btn.primary')

        p.promise = p.promise.eval('window.location.pathname', function( err, res ){
          assert( res === '/sign_up', path+' url === /sign_up' );
        })
        .get('/logout')
        .sleep(1000)
        .acceptAlert()
        .then( done.bind(null, null) );
      });

    });

    describe('v2', function(){

      it('Should show error message on error',
        testError('/sign_up?v=2', '.email', '.password', '.btn.signup', '.signup-form .error' ) );

      it('Should go to nux on success', function( done ){
        p.promise = p.promise.get('/sign_up?v=2');

        util.execute_signup('.email', '.password', '.btn.signup')

        p.promise = p.promise.eval('window.location.pathname', function( err, res ){
          assert( res === '/sign_up', path+' url === /sign_up' );
        })
        .then( done.bind(null, null) );

      });

    });

    describe('v3', function(){

      it('Should show error message on error',
        testError('/sign_up?v=2', '.email', '.password', '.btn.signup', '.signup-form .error' ) );

      it('Should go to nux on success', function( done ){
        p.promise = p.promise.get('/sign_up?v=3');

        util.execute_signup('.email', '.password', '.btn.signup')

        p.promise = p.promise.eval('window.location.pathname', function( err, res ){
          assert( res === '/sign_up', path+' url === /sign_up' );
        })
        .then( done.bind(null, null) );

      });

    });

    describe('v4', function(){

      it('Should show error message on error',
        testError('/sign_up?v=2', '.email', '.password', '.btn.signup', '.signup-form .error' ) );

      it('Should go to nux on success', function( done ){
        p.promise = p.promise.get('/sign_up?v=4');

        util.execute_signup('.email', '.password', '.btn.signup')

        p.promise = p.promise.eval('window.location.pathname', function( err, res ){
          assert( res === '/sign_up', path+' url === /sign_up' );
        })
        .then( done.bind(null, null) );

      });

    });
  });

  // describe('Payment ', function(){
  //   describe('v3 ( Default )', function(){ 
      
  //   });
  //   describe('v10 ( Prime trial flow ) ', function(){

  //   });
  // });  

  // close the browser when done
  after(function( done ){
    p.promise = p.promise
      .quit()
      .then( done );
  });

});