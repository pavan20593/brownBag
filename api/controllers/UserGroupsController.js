/**
 * UserGroupsController
 *
 * @description :: Server-side logic for managing Usergroups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    update: function(req, res) {
        var params = {};
        params.extraPeople = req.body.extraPeople;
        params.userId = parseInt(req.param("userId"));
        params.groupId = req.param("groupId");
        params.accessToken = req.headers['access-token'];
        params.userAgent = req.headers['user-agent'];

        userGroupService = new UserGroupService();
        userGroupService.addExtraPeople(params, function(err, result) {
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

    lunchGroupCancel: function(req, res) {
        var params = {};
        params.cancellationReasonId = req.body.cancellationReasonId;
        params.userId = parseInt(req.param('userId'));
        params.groupId = parseInt(req.param('groupId'));
        params.accessToken = req.headers['access-token'];
        params.userAgent = req.headers['user-agent'];

        userGroupService = new UserGroupService();
        userGroupService.groupCancel(params, function(err, result) {
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