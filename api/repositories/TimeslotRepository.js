'use strict';

var BaseRepository = require('./BaseRepository.js');

class TimeslotRepository extends BaseRepository{
	constructor(){
		super(sails.models.timeslots);
	}
};

module.exports = TimeslotRepository;