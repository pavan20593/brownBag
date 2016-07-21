'use strict';

var BaseRepository = require('./BaseRepository.js');

class LunchCancellationReasonRepository extends BaseRepository{
	constructor(){
		super(sails.models.lunchcancellationreasons);
	}
};
module.exports = LunchCancellationReasonRepository;