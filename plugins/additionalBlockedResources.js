const blockedFromEnv = (process.env.BLOCKED_RESOURCES || '').split(';').filter(e => e !== '');

const blockedResources = [
	"widget.intercom.io",
	...blockedFromEnv
];

module.exports = {
	tabCreated: (req, res, next) => {
		req.prerender.tab.Network.setBlockedURLs({
			urls: blockedResources
		}).then(() => {
			next();
		}).catch(() => {
			res.send(504);
		});
	}
};
