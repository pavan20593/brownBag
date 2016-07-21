'use strict';

var BaseRepository = require('./BaseRepository.js');

class ProximityNormalGroupRepository extends BaseRepository {

    constructor() {
        super(sails.models.proximitynormalgroups);
    }

}

module.exports = ProximityNormalGroupRepository;