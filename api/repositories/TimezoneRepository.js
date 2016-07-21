'use strict';

var BaseRepository = require('./BaseRepository.js');

class TimezoneRepository extends BaseRepository{
	constructor(){
		super(sails.models.timezones);
	}
};

module.exports = TimezoneRepository;