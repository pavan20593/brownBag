var validations = require("../validations/validations.js");
var error = require("../errors/errors.js");

module.exports = function(req, res, next) {

    var userAgent = req.headers['user-agent'];
    var accessToken = req.headers['access-token'];

    //User Agent Validation
    if (!validations.userAgentValidation(userAgent)) {
        return res.badRequest({ exception: error.invalidUserAgentProvided().exception });
    }

    var accessTokensService = new AccessTokensService();
    var options = {
        where: {
            accessToken: accessToken
        }
    };


    accessTokensService.find(options, function(err, result) {
        if (err || !result) {
            return res.badRequest({ exception: error.givenUserIsNotAuthorised().exception });
        }

        if (result) {
            req.accessTokenDetails = result
            next();
        }
    });

};