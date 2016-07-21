'use strict';

var BaseRepository = require('./BaseRepository.js');

class DomainsRepository extends BaseRepository {

    constructor() {
        super(sails.models.domains);
    }

}

module.exports = DomainsRepository;