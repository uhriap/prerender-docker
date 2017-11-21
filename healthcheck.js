module.exports = (healthcheckEndpoint) => {
	return {
		requestReceived(req, res, next) {
			if (req.prerender.url === healthcheckEndpoint) {
				console.log('Handling healthcheck');
				res.send(200, 'OK');
				return;
			}
			return next();
		}
	};
};
