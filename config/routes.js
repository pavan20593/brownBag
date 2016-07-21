/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/
    '/': {
        view: 'homepage'
    },

    //Shubham Routes
    'post /bb/v1/users/login': 'AuthenticationProvidersController.login',
    'delete /bb/v1/users/:userId/logout': 'AuthenticationProvidersController.logout',
    'post /bb/v1/admin/login': 'AuthenticationProvidersController.adminLogin',
    'delete /bb/v1/admin/logout': 'AuthenticationProvidersController.adminLogOut',
    'post /bb/v1/users/socialLogin': 'UsersController.socialLogin',
    'post /bb/v1/users/forgotPassword': 'UsersController.forgotPassword',
    'put /bb/v1/users/resetPassword': 'UsersController.resetPassword',
    'put /bb/v1/admin/settings': 'ProximityNormalGroupController.settings',
    'get /bb/v1/admin/users': 'UsersController.getRegisteredUsers',
    'get /bb/v1/admin/company': 'CompanyController.getCompanyDetails',
    'post /bb/v1/users/signUp': 'UsersController.signUp',
    'post /bb/v1/users/:userId/upload': 'UsersController.uploadProfilePicture',
    'post /bb/v1/admin/company': 'CompanyController.create',
    'put /bb/v1/admin/company/:companyId/domain/:domainId': 'CompanyController.edit',
    'get /bb/v1/admin/groupList': 'GroupsController.getGroupDetails',
    'get /bb/v1/admin/getOnlyCompanies': 'CompanyController.getOnlyCompanies',
    'get /bb/v1/users/:userId/status': 'GroupsController.getUserStatus',
    'get /bb/v1/admin/settings': 'ProximityNormalGroupController.get',


    //Manju's Routes
    'put /bb/v1/users/:userId': 'UsersController.update',
    'put /bb/v1/users/:userId/groups/:groupId': 'UserGroupsController.update',
    'put /bb/v1/users/:userId/groups/:groupId/cancel': 'UserGroupsController.lunchGroupCancel',
    'post /bb/v1/users/:userId/addToGroup': 'GroupsController.create',
    'get /bb/v1/users/:userId/getTimeslots': 'TimeslotsController.find'



    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

};