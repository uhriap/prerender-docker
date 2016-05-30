var prerender = require('prerender');

var server = prerender({
    workers: process.env.PRERENDER_NUM_WORKERS || 4
});


server.use(prerender.sendPrerenderHeader());
server.use(prerender.blacklist());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();

