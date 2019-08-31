var AWS = require('aws-sdk');
var sf = require('node-salesforce');



exports.handler = function(event, context, callback) {

 console.log("event ", JSON.stringify(event));
 var eventbody = event.body;

 console.log("event32 ", event.body);


 console.log("event4 ", event);




 //const params = querystring.parse(event.body);
 const response = {
  statusCode: 200,
  headers: {
   "Access-Control-Allow-Origin": "*", // Required for CORS support to work
   "Content-Type": "application/json",
   "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
  },
  //body: JSON.stringify({ "message": "Hello World!" })
  body: JSON.stringify(event)
 };



 var conn = new sf.Connection({
  oauth2: {
   // you can change loginUrl to connect to sandbox. By default it uses production.
   // loginUrl : 'https://test.salesforce.com',
   clientId: 'createaconnectedappid',
   clientSecret: 'createaconnectedappsecret',
   redirectUri: 'http://localhost:3000/oauth/_callback',
   loginUrl: 'https://login.salesforce.com'
  }
 });
 conn.login('username@salesforce.com', 'getyourownpassword', function(err, userInfo) {
  if (err) {
   return console.error(err);
  }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);


  var records = [];
  var emailtest = 'asfasd@gmail.com';


  conn.sobject("Lead")
   .find({
    Email: emailtest
   }, '*') // fields in asterisk, means wildcard.
   .execute(function(err, records) {
    if (err) {
     return console.error(err);
    }
    console.log(records);
    console.log(records.Id);
    console.log(records[0].Id);



   });





  conn.query("SELECT Id, Name FROM Account LIMIT 1")
   .then(function(res) {
    // receive resolved result from the promise,
    // then return another promise for continuing API execution.
    console.log("total : " + res.totalSize);

    console.log("then2 : ");
    console.log("then3 : " + res.records[0].Id);
    console.log("total : " + res.totalSize);
    //return conn.sobject('Account').create({ Name: 'Another Account' });
    return conn.sobject("Contact").create({
     LastName: 'nodejsalesforce',
     Email: 'ndfo234esf@gmail.com',
     AccountId: res.records[0].Id
    });
   }),
   function(err) {
    // catch any errors in execution
    // ...
   };





  // execute anonymous Apex Code
  var apexBody = "System.debug('Hello, World! Nick Huber');";
  conn.tooling.executeAnonymous(apexBody, function(err, res) {
   if (err) {
    return console.error(err);
   }
   console.log(res.compiled); // compiled successfully
   console.log(res.success); // executed successfully
   // ...
  });


  // ...
 });





 callback(null, response);
};
