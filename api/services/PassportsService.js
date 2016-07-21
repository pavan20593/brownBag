'use strict';

var PassportsRepository = require('../repositories/PassportsRepository.js');


class PassportsService {

    /**
     * save: It is an function to save details into the passports table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var passportsRepository = new PassportsRepository();
        passportsRepository.save(params, callback);
    }

    /**
     * find: It is an function to get passports details based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var passportsRepository = new PassportsRepository();
        passportsRepository.find(params, callback);
    }
}

module.exports = PassportsService;