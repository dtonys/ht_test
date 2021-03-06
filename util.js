var app = require('./app')
var browser = app.browser;
var p = app.p;

var letters = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
];

var digits = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ]

// var _url2 = exports._url2 = function( url ){
//   return browser.get( url );
// };

// var _url = exports._url = function( url ){
//   return p.promise.get( app.environment + url);
// };

// var url = exports.url = function(url_str){
//   url_str = url_str || '';
//   browser.get(app.environment + url_str);
// };

// var login = exports.login = function(){
//   promise.get('https://qa2.healthtap.com')
// };

var randomString = exports.randomString = function( str_length ){
  var str = '';
  for( var i = 0; i < str_length; i++ ){
    str += letters[Math.floor(Math.random()*letters.length)];
  };
  return str;
};

var randomNumString = exports.randomNumString = function( str_length ){
  var str = '';
  for( var i = 0; i < str_length; i++ ){
    str += digits[Math.floor(Math.random()*digits.length)];
  };
  return str;
};


var login = exports.login = function( user_name, password ){
  p.promise = p.promise
    .get("/login")
    .elementByCss('.email-input').type(user_name)
    .elementByCss('.password-input').type(password)
    .elementByCss('.submit-form').click()
    .sleep(5000);
};

var logout = exports.logout = function(){

  p.promise = p.promise
    .get("/logout")
    .sleep(3000);
};

var execute_signup = exports.execute_signup = function( $email, $password, $submit, args ){
  args = args || {};
  var email = args.email || ( randomString(6)+'@'+randomString(3)+'.'+randomString(3) );
  var password = args.password || randomString(6);

  p.promise = p.promise
  .elementByCss($email).type(email)
  .elementByCss($password).type(password)
  .elementByCss($submit).click()
  .sleep(3000);

};


// var login = exports.login = function(form_selector, username, password){
//   browser
//     .waitFor(form_selector, 3000)
//     .setValue(form_selector+' .email-input', username)
//     .setValue(form_selector+' .password-input', password)
//     .click(form_selector+' .submit-form');
// };

// var clearCookies = exports.clearCookies = function(){
//   browser
//     .deleteCookie('p_flow_viewed')
//     .deleteCookie('entry_point')
//     .deleteCookie('transaction_type')
//     .deleteCookie('price')
//     .deleteCookie('transaction_price')
//     .deleteCookie('visitor_id')
//     .deleteCookie('session_id')
//     .deleteCookie('htuid')
//     .deleteCookie('referrer')
//     .deleteCookie('landing_page')
//     .deleteCookie('entry_point');
// };
