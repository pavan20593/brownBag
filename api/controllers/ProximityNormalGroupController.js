/**
 * ProximityNormalGroupController
 *
 * @description :: Server-side logic for managing Proximitynormalgroups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * settings: It is an API required to change the proximity setup for general users in the Admin portal of the brown bag Application.
     * @param  {object} req The request must contain userId , accessToken and proximity
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    settings: function(req, res) {

        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token'],
            proximity: req.body.proximity
        };

        var proximityNormalGroupService = new ProximityNormalGroupService();

        proximityNormalGroupService.settings(params, function(error, result) {
            if (error) {
                return res.json(error.code, {
                    exception: error.exception
                });
            }

            if (result) {
                return res.ok(result);
            }
        });
    },

    /**
     * get: It is an API required to get the proximity setup for general users in the Admin portal of the brown bag Application.
     * @param  {object} req The request must contain userId and accessToken
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */
    
    get: function(req, res) {
        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token']
        };

        var proximityNormalGroupService = new ProximityNormalGroupService();

        proximityNormalGroupService.get(params, function(error, result) {
            if (error) {
                return res.json(error.code, {
                    exception: error.exception
                });
            }

            if (result) {
                return res.ok(result);
            }
        });
    }
};