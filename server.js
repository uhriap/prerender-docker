const prerender = require('prerender');

const forwardHeaders = require('./forwardHeaders');
const stripHtml = require('./stripHtml');
const healthcheck = require('./healthcheck');
const removePrefetchTags = require('./removePrefetchTags');

const options = {
	pageDoneCheckInterval : 500,
	pageLoadTimeout: 10000,
	waitAfterLastRequest: 250,
	chromeFlags: [ '--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222', '--hide-scrollbars' ],
};
console.log('Starting with options:', options);

const server = prerender(options);

server.use(healthcheck('_health'));
server.use(forwardHeaders);
server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(removePrefetchTags);
server.use(prerender.httpHeaders());
if (process.env.DEBUG_PAGES) {
	server.use(prerender.logger());
}
server.use(stripHtml);

server.start();
