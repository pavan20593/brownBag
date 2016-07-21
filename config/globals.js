/**
 * Global Variable Configuration
 * (sails.config.globals)
 *
 * Configure which global variables which will be exposed
 * automatically by Sails.
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.globals.html
 */
module.exports.globals = {

    /****************************************************************************
     *                                                                           *
     * Expose the lodash installed in Sails core as a global variable. If this   *
     * is disabled, like any other node module you can always run npm install    *
     * lodash --save, then var _ = require('lodash') at the top of any file.     *
     *                                                                           *
     ****************************************************************************/

    // _: true,

    /****************************************************************************
     *                                                                           *
     * Expose the async installed in Sails core as a global variable. If this is *
     * disabled, like any other node module you can always run npm install async *
     * --save, then var async = require('async') at the top of any file.         *
     *                                                                           *
     ****************************************************************************/

    // async: true,

    /****************************************************************************
     *                                                                           *
     * Expose the sails instance representing your app. If this is disabled, you *
     * can still get access via req._sails.                                      *
     *                                                                           *
     ****************************************************************************/

    // sails: true,

    /****************************************************************************
     *                                                                           *
     * Expose each of your app's services as global variables (using their       *
     * "globalId"). E.g. a service defined in api/models/NaturalLanguage.js      *
     * would have a globalId of NaturalLanguage by default. If this is disabled, *
     * you can still access your services via sails.services.*                   *
     *                                                                           *
     ****************************************************************************/

    // services: true,

    /****************************************************************************
     *                                                                           *
     * Expose each of your app's models as global variables (using their         *
     * "globalId"). E.g. a model defined in api/models/User.js would have a      *
     * globalId of User by default. If this is disabled, you can still access    *
     * your models via sails.models.*.                                           *
     *                                                                           *
     ****************************************************************************/

    // models: true

    // Error Codes for APIs defined over here
    badRequestErrorCode: 400,
    forbiddenErrorCode: 403,
    internalServerErrorCode: 500,
    okResponseCode: 200,
    unAuthorisedUserErrorCode: 401,
    routeNotFound: 404,

    // User Agent defined for brown Bag Application
    userAgentIosApp: "brownBag-IOS-Application",
    osTypeIos: "ios",
    adminRoleId: 2,
    userRoleId: 1,
    tempPasswordLengthForForgotPassword: 6

};