/**
 * TimezonesController
 *
 * @description :: Server-side logic for managing Timezones
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function(req, res){
		var params = {};
		params.userAgent = req.headers['user-agent'];
		params.accessToken = req.header['access-token'];
		params.offset = req.param("offset");
		
		var timezonesService = new TimezonesService();

		timezonesService.find(params, function(error, result){
			if (error) {
                return res.json(error.code, {
                    exception: error.exception
                });
            }else{
                return res.ok(result);
            }
		});
	}
};

