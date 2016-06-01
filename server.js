var prerender = require('prerender');

var server = prerender({
	workers: process.env.PRERENDER_NUM_WORKERS || 4
});


server.use({
	//There are some issues with the in-memory cache from PhantomJS 2. It keeps pages in memory,
	//and then simply returns a 304 instead of a 200 whenever possible.
	//Prerender unfortunatally simply proxies this status code, even though the client doesn't necessarily
	//have the page in cache.
	//In order to prevent this we need to clear the memory cache of PhantomJS before each request
	onPhantomPageCreate: function(phantom, req, res, next) {
		//The run function is exposed by phridge (bridge between prerender and PhantomJS), and allows
		//us to run commands in the page context
		req.prerender.page.run(function(resolve) {
			this.clearMemoryCache();
			resolve();
		})
		.then(function() { next() })
		.catch(function() { next() });
	}
});
server.use(prerender.sendPrerenderHeader());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();

