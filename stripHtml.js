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

    var sizeBefore = req.prerender.documentHTML.toString().length;
    req.prerender.documentHTML = minify(req.prerender.documentHTML.toString(), options);
    var sizeAfter = req.prerender.documentHTML.toString().length;

    console.log("Size was reduced by " + Math.round((100*(sizeBefore-sizeAfter)*100/sizeBefore))/100 +"%");

    next();
  }
};
