/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const unAuthorisedUserErrorCode = sails.config.globals.unAuthorisedUserErrorCode;

module.exports = {

    update: function(req, res) {

        var params = req.body;
        var options = {};
        options.where = {};
        options.where.id = req.param('userId');
        params.userId = parseInt(req.param('userId'));
        params.accessToken = req.headers['access-token'];
        params.userAgent = req.headers['user-agent'];

        var usersService = new UsersService();
        usersService.updateAndFind(params, options, function(err, result) {
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

    /**
     * socialLogin: It is an API required to help users do social login via linkedin on brown bag application.
     * @param  {object} req The request must contain userAgent , userDetails, LinkedIn Details and Device Details
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */
    socialLogin: function(req, res) {
        var params = {
            userAgent: req.headers['user-agent'],
            fullName: req.body.fullName,
            email: req.body.email,
            deviceId: req.body.deviceId,
            playerId: req.body.playerId,
            requestType: req.body.requestType,
            deviceType: req.body.deviceType,
            linkedInId: req.body.linkedInId,
            linkedInPublicProfileUrl: req.body.linkedInPublicProfileUrl,
            profilePic: req.body.profilePic,
            companyName: req.body.companyName,
            designation: req.body.designation
        };

        var usersService = new UsersService();

        usersService.socialLogin(params, function(error, result) {
            if (error) {
                if (error.code == unAuthorisedUserErrorCode) {
                    return res.json(error.code, {
                        exception: error.exception,
                        socialData: error.socialData
                    });
                }

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
     * forgotPassword: It is an API required to help users to use the forgot password on brown bag application.
     * @param  {object} req The request must contain userAgent  and email
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    forgotPassword: function(req, res) {
        var params = {
            userAgent: req.headers['user-agent'],
            email: req.body.email
        };

        var usersService = new UsersService();

        usersService.forgetPassword(params, function(error, result) {
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
     * resetPassword: It is an API required to help users to reset there passwords via the forgot password on brown bag application.
     * @param  {object} req The request must contain userAgent,temporary Password, new Password  and email
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    resetPassword: function(req, res) {
        var params = {
            userAgent: req.headers['user-agent'],
            email: req.body.email,
            tempPassword: req.body.tempPassword,
            newPassword: req.body.newPassword
        };

        var usersService = new UsersService();

        usersService.resetPassword(params, function(error, result) {
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
     * getRegisteredUsers: It is an API required to get all the registered users in the brown Bag Application by the Admin on brown bag Admin Portal.
     * @param  {object} req The request must contain userId and accessToken
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    getRegisteredUsers: function(req, res) {
        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token']
        };

        var usersService = new UsersService();

        usersService.getRegisteredUsers(params, function(error, result) {
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
     * signUp: It is an API required to help users to signUp on brown bag application.
     * @param  {object} req The request must contain userAgent , userDetails, LinkedIn Details and Device Details
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    signUp: function(req, res) {

        var params = {
            fullName: req.body.fullName,
            email: req.body.email,
            companyName: req.body.companyName,
            designation: req.body.designation,
            profilePic: req.body.profilePic,
            linkedInPublicProfileUrl: req.body.linkedInPublicProfileUrl,
            password: req.body.password,
            linkedInId: req.body.linkedInId,
            playerId: req.body.playerId,
            deviceId: req.body.deviceId,
            requestType: req.body.requestType,
            deviceType: req.body.deviceType,
            userAgent: req.headers['user-agent']
        };

        var usersService = new UsersService();

        usersService.signUp(params, function(error, result) {
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
     * uploadProfilePicture: It is an API required to help users to Upload there profile pics on brown bag application.
     * @param  {object} req The request must contain userAgent , userDetails and inmage file
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */

    uploadProfilePicture: function(req, res) {
        var params = {
            file: req.file('image'),
            userAgent: req.headers['user-agent'],
            accessToken: req.headers['access-token'],
            userId: parseInt(req.param('userId'))
        };

        var usersService = new UsersService();

        usersService.uploadProfilePicture(params, function(error, result) {
            if (error) {
                return res.json(error.code, {
                    exception: error.exception
                });
            }
            return res.ok(result);
        });
    }

};