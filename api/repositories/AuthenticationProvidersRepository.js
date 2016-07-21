'use strict';

var BaseRepository = require('./BaseRepository.js');

class AuthenticationProviderRepository extends BaseRepository {

    constructor() {
        super(sails.models.authenticationproviders);
    }

}

module.exports = AuthenticationProviderRepository;