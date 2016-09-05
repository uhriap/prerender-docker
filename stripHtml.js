var minify = require('html-minifier').minify;

var options = {
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  collapseWhitespace: true,
  preserveLineBreaks: true
};

module.exports = {
  beforeSend: function(req, res, next) {
    if(!req.prerender.documentHTML) {
      return next();
    }

    req.prerender.documentHTML = minify(req.prerender.documentHTML.toString(), options);

    next();
  }
};
