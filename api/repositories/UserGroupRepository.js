'use strict';

var BaseRepository = require('./BaseRepository.js');

class UserGroupRepository extends BaseRepository{
	constructor(){
		super(sails.models.usergroups);
	}
};

module.exports = UserGroupRepository;