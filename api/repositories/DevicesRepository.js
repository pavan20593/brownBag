'use strict';

var BaseRepository = require('./BaseRepository.js');

class DevicesRepository extends BaseRepository {

    constructor() {
        super(sails.models.devices);
    }

}

module.exports = DevicesRepository;