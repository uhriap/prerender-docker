// Set all blacklisted headers as lowercase
var BLACKLISTED = ['user-agent','host'];

module.exports = {
  // Since prerender does not forward headers, this causes problems for some crawlers looking for
  // e.g. localized content. This plugin ensures the headers sent to prerender are also set in
  // the PhantomJS instance. Some headers may be blacklisted and will not be forwarded.
  onPhantomPageCreate: function (phantom, req, res, next) {
    // The following function is executed in the Phridge context, which means we do not have a
    // regular closure over it. Instead this function is stringified and sent to Phridge, where
    // it is executed.
    function executeInsidePhantom(headers, blacklisted, resolve) {
      var customHeaders = this.customHeaders || {};
      for (var header in headers) {
        if (headers.hasOwnProperty(header) && blacklisted.indexOf(header) === -1) {
          customHeaders[header] = headers[header];
          // console.debug('Forwarding header ' + header);
        }
      }
      this.customHeaders = customHeaders;
      resolve();
    }

    // By setting the headers as an argument here, they will be bound in the function in Phridge.
    // Transformation is done using JSON.stringify and the resulting JSON object is unpacked in
    // Phridge. We use a promise based approach so we can detect when phridge has set the headers,
    // and we continue the middleware chain.
    req.prerender.page.run(req.headers, BLACKLISTED, executeInsidePhantom
    ).then(function () {
      next();
    }).catch(function () {
      res.sendStatus(statusCode);
      res.end('Could not forward sent headers');
    });
  }
};
