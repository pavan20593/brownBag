'use strict';

var SubCapabilitiesRepository = require('../repositories/SubCapabilitiesRepository.js');


class SubCapabilitiesService {

    /**
     * save: It is an function to save the sub capabilities into the database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var subCapabilitiesRepository = new SubCapabilitiesRepository();
        subCapabilitiesRepository.save(params, callback);
    }

    /**
     * find: It is an function to find sub capabilities based on the params passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var subCapabilitiesRepository = new SubCapabilitiesRepository();
        subCapabilitiesRepository.find(params, callback);
    }

    /**
     * upsert: It is an function  to upsert into sub capabilities table based on the params passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */
    upsert(params, callback) {
        var subCapabilitiesRepository = new SubCapabilitiesRepository();
        subCapabilitiesRepository.upsert(params, callback);
    }
}

module.exports = SubCapabilitiesService;