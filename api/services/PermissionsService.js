'use strict';

var PermissionsRepository = require('../repositories/PermissionsRepository.js');


class PermissionsService {

    /**
     * save: It is an function to save details into the permissions table.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */
    
    save(params, callback) {
        var permissionsRepository = new PermissionsRepository();
        permissionsRepository.save(params, callback);
    }

    /**
     * find: It is an function to find details in the permissions table based on the parameters passed.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */
    
    find(params, callback) {
        var permissionsRepository = new PermissionsRepository();
        permissionsRepository.find(params, callback);
    }

    /**
     * upsert: It is an function to upsert details into the permissions table based on the parameters passeds.
     * @return {object} callback Success or Failure response based on the parameters passed to this function
     */
    
    upsert(params, callback) {
        var permissionsRepository = new PermissionsRepository();
        permissionsRepository.upsert(params, callback);
    }
}

module.exports = PermissionsService;