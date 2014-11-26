var JamaPassthrough = require('./../index');
var restEndpoint = 'http://localhost:8080/contour/rest/v1'; // YOUR REST API HERE
var optionalCORS = ['*']; //* for development but in production I recommend limiting to your app host

var JamaAPI = new JamaPassthrough({
    restEndpoint: restEndpoint,
    allowedCORS: optionalCORS,
    port: 9999
});
JamaAPI.start();//Listens on Port 9999 unless otherwise specified