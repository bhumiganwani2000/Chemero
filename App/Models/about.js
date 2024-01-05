const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const aboutSchema = new Schema({
	
	heading: {
		type: 'string',
		required: true
	},
	introduction: {
		type: 'string',
		required: true
	},
	ourFacts: {
		type: 'string',
		required: true
	},
	yearsExperience: {
		type: 'number',
		required: true
	},
	yearlyProduction: {
		type: 'number',
		required: true
	},
	clients: {
		type: 'number',
		required: true
	},
	ourValues: {
		type: 'string',
		required: true
	},
	ourMission: {
		type: 'string',
		required: true
	},
	about_image: {
		type: 'string',
		required: true
	},
	createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },
	
},{ collection: 'about' });
mongoose.model('about', aboutSchema);
