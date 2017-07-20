const minify = require('html-minifier').minify;

const COMPRESSION_HEADER = 'X-Prerender-Compression-Ratio';
const options = {
	minifyCSS : true,
	minifyJS : true,
	removeComments : true,
	collapseWhitespace : true,
	preserveLineBreaks : true,
	removeEmptyAttributes : false,
	removeEmptyElements : false,
};

module.exports = {
	beforeSend(req, res, next) {
		if (!req.prerender.documentHTML) {
			return next();
		}

		const sizeBefore = req.prerender.documentHTML.toString().length;
		try {
			req.prerender.documentHTML = minify(req.prerender.documentHTML.toString(), options);
		} catch (e) {
			console.error("These was a problem parsing the HTML. The following was thrown. Please fix asap", e);
		}
		const sizeAfter = req.prerender.documentHTML.toString().length;
		res.setHeader(COMPRESSION_HEADER, ((sizeBefore - sizeAfter) / sizeBefore).toFixed(4));

		next();
	}
};
