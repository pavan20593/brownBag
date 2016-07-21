/**
 * GroupsController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    create: function(req, res) {
        var params = {};
        params.userAgent = req.header['user-agent'];
        params.accessToken = req.header['access-token'];
        params.timeslotId = req.body.timeslotId;
        params.timeslot = req.body.timeslot;
        params.tag = req.body.tag;
        params.latitude = req.body.latitude;
        params.longitude = req.body.longitude;
        params.userId = parseInt(req.param('userId'));
        params.accessToken = req.headers['access-token'];
        params.userAgent = req.headers['user-agent'];

        var groupsService = new GroupsService();
        groupsService.addToGroup(params, function(err, result) {
            if (err) {
                return res.json(err.code, {
                    exception: err.exception
                });
            }
            if (result) {
                return res.ok(result);
            }
        });
    },

    getGroupDetails: function(req, res) {
        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token'],
            query: req.query
        };

        var groupsService = new GroupsService();

        groupsService.getGroupDetails(params, function(error, result) {
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

    getUserStatus: function(req, res) {
        var params = {
            userId: parseInt(req.param('userId')),
            accessToken: req.headers['access-token'],
            userAgent: req.headers['user-agent']
        };

        var groupsService = new GroupsService();

        groupsService.getUserStatus(params, function(error, result) {
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