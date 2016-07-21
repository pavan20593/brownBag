'use strict';

var BaseRepository = require('./BaseRepository.js');

class PermissionsRepository extends BaseRepository {

    constructor() {
        super(sails.models.permissions);
    }

}

module.exports = PermissionsRepository;