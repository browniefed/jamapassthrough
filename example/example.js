var JamaPassthrough = require('./../index');
var restEndpoint = 'https://localhost:8080/rest/v1';

var JamaAPI = new JamaPassthrough(restEndpoint);
JamaAPI.start();