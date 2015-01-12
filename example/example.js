var JamaPassthrough = require('./../index');
var restEndpoint = 'http://localhost:8080/contour/rest/v1'; // YOUR REST API HERE
var optionalCORS = ['*']; //* for development but in production I recommend limiting to your app host
var port = 9999;

var JamaAPI = new JamaPassthrough({
    restEndpoint: restEndpoint,
    allowedCORS: optionalCORS,
    port: port
});
JamaAPI.start();//Listens on Port 9999 unless otherwise specified
console.log('Your REST API is at ' + restEndpoint);
console.log('listening for requests on port ' + port);