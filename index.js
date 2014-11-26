var restify = require('restify');

var JamaPassthrough = function(restEndpoint, allowedCORS) {
	this.setRestEndpoint(restEndpoint);
	this.setAllowedCORS(allowedCORS || ['*'])
}

JamaPassthrough.prototype.setRestEndpoint = function(restEndpoint) {
	this.restEndpoint = restEndpoint;
}

JamaPassthrough.prototype.getRestEndpoint = function() {
	return this.restEndpoint;
}

JamaPassthrough.prototype.setAllowedCORS = function(allowedCORS) {
	this.allowedCORS = allowedCORS;
}

JamaPassthrough.prototype.getJsonClient = function(headers) {
	var options = {
	  url: this.getRestEndpoint(),
	  version: 'v1',
	  headers: headers || {}
	};

	return restify.createJsonClient(options);
}
JamaPassthrough.prototype.setupServer = function() {

	this.server = restify.createServer();

	//This defaults to accepting ALL connections.
	//In production this should definitely be limited to your production environment
	this.server.use(restify.CORS({
		origins: this.allowedCORS
	}));

	this.server.use(restify.bodyParser());


	this.server.get(/(.*)/, this.respond.bind(this));
	this.server.put(/(.*)/, this.respond.bind(this));
	this.server.post(/(.*)/, this.respond.bind(this));
	this.server.del(/(.*)/, this.respond.bind(this));
	this.server.listen(9999, function() {
		console.log('started');
	});
}

JamaPassthrough.prototype.respond = function(req, res, next) {
	//Get req path
	//Use client ot respond
	//respond
	var method = (req.method || 'get').toLowerCase();
	var client = this.getJsonClient(req.headers);
	client[method](req._path, function(error, request, response) {
		res.send('Hey');
	})

}

JamaPassthrough.prototype.start = function() {
	if (!this.getRestEndpoint()){
		console.warn("Warning: No rest endpoint has been set");
	}

	this.setupServer();
}
module.exports = JamaPassthrough;