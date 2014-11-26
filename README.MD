#JamaPassthrough
==================

This is a REST API pass through for Jama that supports CORS for easy web development.

How to use

```
npm install jama-passthrough
```

Then create a server for yourself

```
var JamaPassthrough = require('jama-passthrough');
var restEndpoint = 'http://localhost:8080/contour/rest/v1'; // YOUR REST API HERE
var optionalCORS = ['*']; //* for development but in production I recommend limiting to your app host

var JamaAPI = new JamaPassthrough({
    restEndpoint: restEndpoint,
    allowedCORS: optionalCORS,
    port: 9999
});
JamaAPI.start();//Listens on Port 9999 unless otherwise specified

```

Issues: Doesn't do anything smart about form data so uploaded attachments is not supported just yet.