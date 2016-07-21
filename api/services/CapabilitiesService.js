'use strict';

var CapabilitiesRepository = require('../repositories/CapabilitiesRepository.js');


class CapabilitiesService {

    /**
     * save: It is an function to save capabilities into the database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var capabilitiesRepository = new CapabilitiesRepository();
        capabilitiesRepository.save(params, callback);
    }

    /**
     * find: It is an function to find capability based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var capabilitiesRepository = new CapabilitiesRepository();
        capabilitiesRepository.find(params, callback);
    }

    /**
     * upsert: It is an function to upsert details into the capabilities table based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    upsert(params, callback) {
        var capabilitiesRepository = new CapabilitiesRepository();
        capabilitiesRepository.upsert(params, callback);
    }
}

module.exports = CapabilitiesService;