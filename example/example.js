var JamaPassthrough = require('./../index');
var restEndpoint = 'http://localhost:8080/contour/rest/v1';

var JamaAPI = new JamaPassthrough(restEndpoint);
JamaAPI.start();