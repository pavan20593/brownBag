/**
 * AuthenticationProvidersController
 *
 * @description :: Server-side logic for managing Authenticationproviders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * login: It is an API required to Login a Registered user on Brown Bag Application
     * @param  {object} req The request must contain userAgent,email, password,device Details etc
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */
    login: function(req, res) {
        var params = {
            userAgent: req.headers['user-agent'],
            email: req.body.email,
            password: req.body.password,
            deviceId: req.body.deviceId,
            playerId: req.body.playerId,
            requestType: req.body.requestType,
            deviceType: req.body.deviceType
        };

        var authenticationProvidersService = new AuthenticationProvidersService();

        authenticationProvidersService.login(params, function(error, result) {
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
     * logout: It is an API required to Logout a Registered user on Brown Bag Application
     * @param  {object} req The request must contain userAgent,access token and userId.
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */
    logout: function(req, res) {
        var params = {
            userAgent: req.headers['user-agent'],
            accessToken: req.headers['access-token'],
            userId: req.param('userId')
        };

        var authenticationProvidersService = new AuthenticationProvidersService();

        authenticationProvidersService.logout(params, function(error, result) {
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
     * adminLogin: It is an API required to Login only the Admin to the Admin portal of Brown Bag 
     * @param  {object} req The request must contain email and password.
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */
    adminLogin: function(req, res) {
        var params = {
            email: req.body.email,
            password: req.body.password
        };

        var authenticationProvidersService = new AuthenticationProvidersService();

        authenticationProvidersService.adminLogin(params, function(error, result) {
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
     * adminLogOut: It is an API required to Logout only the Admin to the Admin portal of Brown Bag 
     * @param  {object} req The request must contain userId and accessToken.
     * @param  {object} res Success or Failure response based on the parameters passed to this API
     * @return {object}     Success or Failure response based on the parameters passed to this API
     */
    adminLogOut: function(req, res) {
        var params = {
            userId: parseInt(req.headers['userid']),
            accessToken: req.headers['access-token']
        };

        var authenticationProvidersService = new AuthenticationProvidersService();

        authenticationProvidersService.adminLogOut(params, function(error, result) {
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
    
};