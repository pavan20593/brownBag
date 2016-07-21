'use strict';

var AccessTokensRepository = require('../repositories/AccessTokensRepository.js');


class AccessTokensService {

    /**
     * save: It is an function to save the access token in the database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var accessTokensRepository = new AccessTokensRepository();
        accessTokensRepository.save(params, callback);
    }

    /**
     * find: It is an function to find the access token in the database table based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var accessTokensRepository = new AccessTokensRepository();
        accessTokensRepository.find(params, callback);
    }
}

module.exports = AccessTokensService;