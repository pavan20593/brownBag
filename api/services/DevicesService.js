'use strict';

var DevicesRepository = require('../repositories/DevicesRepository.js');


class DevicesService {

    /**
     * save: It is an function to save the device details in the database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    save(params, callback) {
        var devicesRepository = new DevicesRepository();
        devicesRepository.save(params, callback);
    }

    /**
     * find: It is an function to find the device details in the database table based in the details passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */

    find(params, callback) {
        var devicesRepository = new DevicesRepository();
        devicesRepository.find(params, callback);
    }

    /**
     * upsert: It is an function to upsert the device details in the database table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */
    
    upsert(params, callback) {
        var devicesRepository = new DevicesRepository();
        devicesRepository.upsert(params, callback);
    }
}

module.exports = DevicesService;