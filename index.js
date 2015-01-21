var restify = require('restify'),
    request = require('request'),
    qs = require('querystring');

var JamaPassthrough = function(options) {
	this.setRestEndpoint(options.restEndpoint);
	this.setAllowedCORS(options.allowedCORS || ['*']);
    this.setPort(options.port || 9999);
}

JamaPassthrough.prototype.setRestEndpoint = function(restEndpoint) {
	this.restEndpoint = restEndpoint;
}

JamaPassthrough.prototype.getRestEndpoint = function() {
	return this.restEndpoint;
}

JamaPassthrough.prototype.setPort = function(port) {
    this.port = port;
}

JamaPassthrough.prototype.getPort = function() {
    return this.port;
}


JamaPassthrough.prototype.setAllowedCORS = function(allowedCORS) {
	this.allowedCORS = allowedCORS;
}
JamaPassthrough.prototype.getAllowedCORS = function(allowedCORS) {
    return this.allowedCORS;
}
JamaPassthrough.prototype.setupServer = function() {

	this.server = restify.createServer();

    this.server.use(restify.CORS({
        origins: this.getAllowedCORS()
    }));
    this.server.use(restify.authorizationParser());
    this.server.use(restify.bodyParser());
    this.server.use(restify.queryParser());

	//This defaults to accepting ALL connections.
	//In production this should definitely be limited to your production environment
	this.server.get(/(.*)/, this.respond.bind(this));
	this.server.put(/(.*)/, this.respond.bind(this));
	this.server.post(/(.*)/, this.respond.bind(this));
	this.server.del(/(.*)/, this.respond.bind(this));
	this.server.listen(this.getPort(), function() {
		console.log('started');
	});

    this.server.on('MethodNotAllowed', unknownMethodHandler);

}

JamaPassthrough.prototype.respond = function(req, res, next) {
    var method = (req.method || 'get').toUpperCase();

    var body = req.body;
    if (method == 'GET') {
        body = qs.parse(req.body || '')
    }

    request({
        url: this.getRestEndpoint() + req.url,
        body: body,
        method: method,
        json: true,
        headers: {
            authorization: req.headers.authorization
        }
    }, function(jamaErr, jamaRes, jamaBody) {
        res.send(jamaRes.statusCode, jamaBody);
    })
}

JamaPassthrough.prototype.start = function() {
	if (!this.getRestEndpoint()){
		console.warn("Warning: No rest endpoint has been set");
	}
	this.setupServer();
}

/*
    Make it so restify handles preflight OPTION requests.
    Just accept eveything initially we can limit ourselves via restify.CORS()
*/
function unknownMethodHandler(req, res) {
  if (req.method.toLowerCase() === 'options') {
    var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With', 'Authorization']; // added Origin & X-Requested-With & **Authorization**

    if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
    res.header('Access-Control-Allow-Methods', res.methods.join(', '));
    res.header('Access-Control-Allow-Origin', req.headers.origin);

    return res.send(200);
  }
  else
    return res.send(new restify.MethodNotAllowedError());
}

module.exports = JamaPassthrough;