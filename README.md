Selenium test with WD.js

Get selenium server and place into PATH:

curl -o /usr/bin/selenium-server-standalone-2.43.0.jar http://selenium-release.storage.googleapis.com/2.43/selenium-server-standalone-2.43.0.jar

Get Chrome Driver, put into PATH: http://chromedriver.storage.googleapis.com/index.html?path=2.9/

Start Selenium server: java -jar /usr/bin/selenium-server-standalone-2.43.0.jar

Run the test: mocha app.js

See https://github.com/admc/wd for details.


Useful links:

Mapping to Selenium API
- https://github.com/admc/wd/blob/master/doc/api.md
Braintree Sandbox
- https://www.braintreepayments.com/docs/ruby/reference/sandbox

