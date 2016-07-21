/**
 * TimeslotsController
 *
 * @description :: Server-side logic for managing Timeslots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    find: function(req, res) {
        var params = {};
        params.userId = parseInt(req.param('userId'));
        params.timezone = req.query['timezone']
        params.accessToken = req.headers['access-token'];
        params.userAgent = req.headers['user-agent'];

        var timeslotsService = new TimeslotsService();

        timeslotsService.listOfTimeslots(params, function(err, result) {
            if (err) {
                return res.json(err.code, {
                    exception: err.exception
                });
            }
            if (result) {
                return res.ok(result);
            }
        });
    }
};