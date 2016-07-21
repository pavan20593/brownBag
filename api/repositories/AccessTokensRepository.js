'use strict';

var BaseRepository = require('./BaseRepository.js');

class AccessTokensRepository extends BaseRepository {

    constructor() {
        super(sails.models.accesstokens);
    }

}

module.exports = AccessTokensRepository;