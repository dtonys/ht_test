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

// describe('Check if Logged Out Pages Load', function(){

//   describe('Static Pages Should Load < 5 Seconds', function(){
//     this.timeout(5000);

//     _.each( config.static_page_urls, function(url, index){
//       it(' GET '+url+' => 200', function( done ){
//         var path = environments[environment]+url;
//         request( path, function(err, response, body){
//           assert( response.statusCode === 200, path+' loads successfully' );
//           done();
//         });
//       });
//     });
//   });

//   describe('SEO Pages Should Load < 5 Seconds', function(){
//     this.timeout(4000);
//     _.each( config.seo_page_urls, function(url, index){
//       it(' GET '+url+' => 200', function( done ){
//         var path = environments[environment]+url;
//         request( path, function(err, response, body){
//           assert( response.statusCode === 200, path+' loads successfully' );
//           done();
//         });
//       });
//     });
//   });

// });


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

  // describe('Logout', function(){

  //   before(function( done ){
  //     util.logout();
  //     p.promise = p.promise.then( done.bind(null, null) )
  //   });

  //   it('Should set guest flag', function( done ){

  //     p.promise.eval('App.defaults.user_json.person.guest', function( err, res ){
  //       assert( res === true, path+' guest flag set' );
  //       return p.promise;
  //     })
  //     .then( done.bind(null, null) );

  //   });

  //   it('Should land on home page', function( done ){

  //     p.promise.eval('window.location.pathname', function( err, res ){
  //       assert( res === '/', path+' url is home page' );
  //       return p.promise;
  //     })
  //     .then( done.bind(null, null) );

  //   });

  // });

  // describe('Member Login ', function(){

  //   before(function( done ){
  //     util.logout();
  //     util.login(member_name, member_password);
  //     p.promise = p.promise.then( done.bind(null, null) );
  //   });

  //   it('Should set member flag', function( done ){
  //     p.promise = p.promise.eval('App.defaults.user_json.person.member', function( err, res ){
  //       assert( res === true, path+' member flag set' );
  //       return p.promise;
  //     })
  //     .then( done.bind(null, null) );
  //   });
  // });

  // describe('Expert Login ', function(){

  //   before(function( done ){
  //     util.logout();
  //     util.login(expert_name, expert_password);
  //     p.promise = p.promise.then( done.bind(null, null) );
  //   });

  //   it('Should set expert flag', function( done ){
  //     p.promise = p.promise.eval('App.defaults.user_json.person.expert', function( err, res ){
  //       assert( res === true, path+' expert flag set' );
  //       return p.promise;
  //     })
  //     .then( done.bind(null, null) );
  //   });

  // });

  // describe('Sign Up ', function(){

  //   function testSignupError( url, $email, $password, $submit, $error ){

  //     return function( done ){
  //       p.promise = p.promise.get( url );

  //       util.execute_signup( $email, $password, $submit, {
  //         email: 'member1003@gmail.com',
  //         password: 'wrong_password'
  //       })

  //       p.promise = p.promise
  //       .sleep(2000)
  //       .elementByCssOrNull( $error, function(err, el){
  //         assert( !!el, ' error found ');
  //       })
  //       .isDisplayed(function( err, res ){
  //          assert( res === true, ' error is visible ');
  //       })
  //       .then( done.bind(null, null) );
  //     }

  //   }

  //   // todo
  //   // function testSuccess( $email, $password ){
  //   // }

  //   beforeEach(function( done ){
  //     util.logout();
  //     p.promise = p.promise.then( done.bind(null, null) );
  //   });

  //   describe('v1', function(){

  //     it('Should show error message on error',
  //       testSignupError('/sign_up?v=1', '.email-input', '.password-input', '.btn.primary', '.signup-form .error' ) );

  //     it('Should go to nux on success', function( done ){
  //       p.promise = p.promise.get('/sign_up?v=1');

  //       util.execute_signup('.email-input', '.password-input', '.btn.primary')

  //       p.promise = p.promise.eval('window.location.pathname', function( err, res ){
  //         assert( res === '/sign_up', path+' url === /sign_up' );
  //       })
  //       .get('/logout')
  //       .sleep(1000)
  //       .acceptAlert()
  //       .then( done.bind(null, null) );
  //     });

  //   });

  //   describe('v2', function(){

  //     it('Should show error message on error',
  //       testSignupError('/sign_up?v=2', '.email', '.password', '.btn.signup', '.signup-form .error' ) );

  //     it('Should go to nux on success', function( done ){
  //       p.promise = p.promise.get('/sign_up?v=2');

  //       util.execute_signup('.email', '.password', '.btn.signup')

  //       p.promise = p.promise.eval('window.location.pathname', function( err, res ){
  //         assert( res === '/sign_up', path+' url === /sign_up' );
  //       })
  //       .then( done.bind(null, null) );

  //     });

  //   });

  //   describe('v3', function(){

  //     it('Should show error message on error',
  //       testSignupError('/sign_up?v=2', '.email', '.password', '.btn.signup', '.signup-form .error' ) );

  //     it('Should go to nux on success', function( done ){
  //       p.promise = p.promise.get('/sign_up?v=3');

  //       util.execute_signup('.email', '.password', '.btn.signup')

  //       p.promise = p.promise.eval('window.location.pathname', function( err, res ){
  //         assert( res === '/sign_up', path+' url === /sign_up' );
  //       })
  //       .then( done.bind(null, null) );

  //     });

  //   });

  //   describe('v4', function(){

  //     it('Should show error message on error',
  //       testSignupError('/sign_up?v=2', '.email', '.password', '.btn.signup', '.signup-form .error' ) );

  //     it('Should go to nux on success', function( done ){
  //       p.promise = p.promise.get('/sign_up?v=4');

  //       util.execute_signup('.email', '.password', '.btn.signup')

  //       p.promise = p.promise.eval('window.location.pathname', function( err, res ){
  //         assert( res === '/sign_up', path+' url === /sign_up' );
  //       })
  //       .then( done.bind(null, null) );

  //     });

  //   });
  // });

  describe('Prime Payment ', function(){

    var first_name = util.randomString(5)+'_bot';
    var last_name = util.randomString(5)+'_bot';
    var email = util.randomString(6)+'@'+util.randomString(3)+'.'+util.randomString(3);
    var password = util.randomString(6);

    var card_name = first_name+' '+last_name;
    // sandbox card data
    var card_number = '4111111111111111';
    var exp = '1118';
    var cvv = '129';
    var phone_number = util.randomNumString(10);
    var zip = util.randomNumString(5);

    before(function( done ){
      console.log( 'util.logout();' )

      util.logout();
      p.promise = p.promise.then( done.bind(null, null) );
    });

    describe('v3 ( Default )', function(){ 

      describe('Submit Button', function(){ 

        it('Becomes enabled on valid info', function( done ){
          // fill out form
          p.promise = p.promise
            .get('/payment?v=3')
            .sleep(1000)
            // signup
            .elementByCss('.first-name').type(first_name)
            .elementByCss('.last-name').type(last_name)
            .elementByCss('.email').type(email)
            .elementByCss('.password').type(password)
            // payment
            .elementByCss('.cardholder-name').type(card_name)
            .elementByCss('.simple_cc_number').type(card_number)
            .elementByCss('.simple_cc_exp').type(exp)
            .elementByCss('.simple_cc_cvv').type(cvv)
            .elementByCss('.phone').type(phone_number)
            .elementByCss('.postal-code').type(zip)
            .sleep(3000)

          p.promise = p.promise
            .elementByCssOrNull( '.submit-btn.disabled', function(err, el){
              console.log('submit btn disabled', el)
              assert( !el, ' submit btn disabled ');
            })
            .sleep(3000)
            .elementByCssOrNull( '.submit-btn', function(err, el){
              console.log('submit btn disabled', el)
              assert( !!el, ' submit btn enabled ');
            })
            .sleep(3000)
            .then( done.bind(null, null) );
        });

        it('Becomes disabled on invalid info', function( done ){
          p.promise = p.promise
            .elementByCss('.email').clear()
            .sleep(3000)
            .elementByCssOrNull( '.submit-btn.disabled', function(err, el){
              assert( !!el, ' submit btn disabled ');
            })
            .sleep(2000)
            .elementByCss('.email').type(email)
            .sleep(2000)
            .then( done.bind(null, null) );
        });

      });

      describe('On Submit', function(){

        it('on error, shows err message', function( done ){ done(); });
        it('on success, sets subcriber flag on page reload', function( done ){ done(); });

      });

    });

    describe('v10 ( Prime trial flow ) ', function(){

      it('static payment leads to payment page with promo code', function( done ){ done(); });
      it('on error, shows err message', function( done ){ done(); });
      it('on success, sets subcriber flag on page reload', function( done ){ done(); });

    });

    describe('Prime Bundles Flow', function(){

      it('static payment leads to payment page with promo code', function( done ){ done(); });
      it('on error, shows err message', function( done ){ done(); });
      it('on success, user should skip payment on in-app prime flow', function( done ){ done(); });

    });

    describe('Settings Flow', function(){

      it('on error, shows err message', function( done ){ done(); });
      it('on success, sets subcriber flag on page reload', function( done ){ done(); });

    });

    describe('In-App Flow', function(){

      it('on error, shows err message', function( done ){ done(); });
      it('on success, sets subcriber flag on page reload', function( done ){ done(); });

    });

  });  

  // close the browser when done
  after(function( done ){
    p.promise = p.promise
      .quit()
      .then( done );
  });

});